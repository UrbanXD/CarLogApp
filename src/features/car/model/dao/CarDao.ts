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
import { OdometerDao } from "../../_features/odometer/model/dao/OdometerDao.ts";
import { FuelTankDao } from "../../_features/fuel/model/dao/FuelTankDao.ts";
import { Car } from "../../schemas/carSchema.ts";
import { ODOMETER_TABLE } from "../../../../database/connector/powersync/tables/odometer.ts";
import { FUEL_TANK_TABLE } from "../../../../database/connector/powersync/tables/fuelTank.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { SupabaseStorageAdapter } from "../../../../database/connector/storage/SupabaseStorageAdapter.ts";
import { CAR_TABLE } from "../../../../database/connector/powersync/tables/car.ts";
import { ODOMETER_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerLog.ts";
import { OdometerLogMapper } from "../../_features/odometer/model/mapper/odometerLogMapper.ts";
import { Dao } from "../../../../database/dao/Dao.ts";

export class CarDao extends Dao<CarTableRow, Car, CarMapper> {
    private readonly storage: SupabaseStorageAdapter;
    private readonly attachmentQueue?: PhotoAttachmentQueue;
    readonly odometerLogMapper: OdometerLogMapper;

    constructor(
        db: Kysely<DatabaseType>,
        storage: SupabaseStorageAdapter,
        attachmentQueue?: PhotoAttachmentQueue,
        makeDao: MakeDao,
        modelDao: ModelDao,
        odometerDao: OdometerDao,
        fuelTankDao: FuelTankDao
    ) {
        super(db, CAR_TABLE, new CarMapper(makeDao, modelDao, odometerDao, fuelTankDao, attachmentQueue));
        this.storage = storage;
        this.attachmentQueue = attachmentQueue;
        this.odometerLogMapper = new OdometerLogMapper();
    }

    async getAll(): Promise<Array<Car>> {
        const carRowArray: Array<CarTableRow> = await this.db
        .selectFrom(this.table)
        .selectAll()
        .orderBy("created_at")
        .orderBy("name")
        .execute();

        return await this.mapper.toDtoArray(carRowArray);
    }

    async create(car: CarTableRow, odometer: OdometerTableRow, fuelTank: FuelTankTableRow): Promise<Car> {
        const insertedCar = await this.db.transaction().execute(async trx => {
            const carRow = await trx
            .insertInto(CAR_TABLE)
            .values(car)
            .returningAll()
            .executeTakeFirstOrThrow();

            await trx
            .insertInto(ODOMETER_TABLE)
            .values(odometer)
            .executeTakeFirstOrThrow();

            const odometerLog: OdometerLogTableRow = this.odometerLogMapper.odometerEntityToEntity(
                odometer,
                carRow.created_at
            );

            await trx
            .insertInto(ODOMETER_LOG_TABLE)
            .values(odometerLog)
            .executeTakeFirstOrThrow();

            await trx
            .insertInto(FUEL_TANK_TABLE)
            .values(fuelTank)
            .executeTakeFirstOrThrow();

            return carRow;
        });

        return await this.mapper.toDto(insertedCar);
    }

    async update(car: CarTableRow, odometer: OdometerTableRow, fuelTank: FuelTankTableRow) {
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
            .executeTakeFirstOrThrow();

            await trx
            .updateTable(FUEL_TANK_TABLE)
            .set(fuelTank)
            .where("id", "=", fuelTank.id)
            .executeTakeFirstOrThrow();

            return carRow;
        });

        return await this.mapper.toDto(updatedCar);
    }

    async delete(carId: string) {
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