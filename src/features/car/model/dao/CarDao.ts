import { Kysely } from "@powersync/kysely-driver";
import {
    CarTableRow,
    DatabaseType,
    FuelTankTableRow,
    OdometerLogTableRow,
    OdometerTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { ModelDao } from "./ModelDao.ts";
import { MakeDao } from "./MakeDao.ts";
import { CarMapper } from "../mapper/carMapper.ts";
import { OdometerDao } from "./OdometerDao.ts";
import { FuelTankDao } from "./FuelTankDao.ts";
import { Car } from "../../schemas/carSchema.ts";
import { ODOMETER_TABLE } from "../../../../database/connector/powersync/tables/odometer.ts";
import { FUEL_TANK_TABLE } from "../../../../database/connector/powersync/tables/fuelTank.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { SupabaseStorageAdapter } from "../../../../database/connector/storage/SupabaseStorageAdapter.ts";
import { CAR_TABLE } from "../../../../database/connector/powersync/tables/car.ts";
import { OdometerLogDao } from "../../../carLog/model/dao/OdometerLogDao.ts";

export class CarDao {
    private readonly db: Kysely<DatabaseType>;
    private readonly storage: SupabaseStorageAdapter;
    private readonly attachmentQueue?: PhotoAttachmentQueue;
    private readonly odometerLogDao: OdometerLogDao;
    readonly mapper: CarMapper;

    constructor(
        db: Kysely<DatabaseType>,
        storage: SupabaseStorageAdapter,
        odometerLogDao: OdometerLogDao,
        attachmentQueue?: PhotoAttachmentQueue
    ) {
        this.db = db;
        this.storage = storage;
        this.attachmentQueue = attachmentQueue;
        this.odometerLogDao = odometerLogDao;

        const makeDao = new MakeDao(this.db);
        const modelDao = new ModelDao(this.db, makeDao);
        const odometerDao = new OdometerDao(this.db);
        const fuelTankDao = new FuelTankDao(this.db);

        this.mapper = new CarMapper(makeDao, modelDao, odometerDao, fuelTankDao, attachmentQueue);
    }

    async getCar(id: string) {
        const carRow: CarTableRow = await this.db
        .selectFrom(CAR_TABLE)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

        return this.mapper.toCarDto(carRow);
    }

    async getCars(): Promise<Array<Car>> {
        const carRowArray: Array<CarTableRow> = await this.db
        .selectFrom(CAR_TABLE)
        .selectAll()
        .orderBy("created_at")
        .orderBy("name")
        .execute();

        return this.mapper.toCarDtoArray(carRowArray);
    }

    async createCar(car: CarTableRow, odometer: OdometerTableRow, fuelTank: FuelTankTableRow): Promise<Car> {
        const insertedCar = await this.db.transaction().execute(async trx => {
            const carRow = await trx
            .insertInto(CAR_TABLE)
            .values(car)
            .returningAll()
            .executeTakeFirstOrThrow();

            await trx
            .insertInto(ODOMETER_TABLE)
            .values(odometer)
            .execute();

            await trx
            .insertInto(FUEL_TANK_TABLE)
            .values(fuelTank)
            .execute();

            return carRow;
        });

        const odometerLog: OdometerLogTableRow = this.odometerLogDao.mapper.fromOdometerEntityToOdometerLogEntity(
            odometer,
            insertedCar.created_at
        );
        await this.odometerLogDao.createOdometerLog(odometerLog);

        return await this.mapper.toCarDto(insertedCar);
    }

    async editCar(car: CarTableRow, odometer: OdometerTableRow, fuelTank: FuelTankTableRow) {
        const updatedCar = await this.db.transaction().execute(async trx => {
            const carRow = await trx
            .updateTable(CAR_TABLE)
            .set(car)
            .where("id", "=", car.id)
            .returningAll()
            .executeTakeFirstOrThrow();

            await trx
            .updateTable(ODOMETER_TABLE)
            .set(odometer)
            .where("id", "=", odometer.id)
            .execute();

            await trx
            .updateTable(FUEL_TANK_TABLE)
            .set(fuelTank)
            .where("id", "=", fuelTank.id)
            .execute();

            return carRow;
        });

        return await this.mapper.toCarDto(updatedCar);
    }

    async deleteCar(carId: string) {
        try {
            const car = await this.getCar(carId);
            if(car?.image && this.attachmentQueue) {
                const imageFilename = attachmentQueue.getLocalFilePathSuffix(car.image);
                const localImageUri = attachmentQueue.getLocalUri(imageFilename);

                await storage.deleteFile(localImageUri);
            }
        } catch(e) {
            console.log("Car image cannot be deleted: ", e);
        }

        const result = await this.db
        .deleteFrom(CAR_TABLE)
        .where("id", "=", carId)
        .returning("id")
        .executeTakeFirstOrThrow();

        return result.id;
    }
}