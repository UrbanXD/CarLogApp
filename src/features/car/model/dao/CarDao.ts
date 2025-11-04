import { Kysely } from "@powersync/kysely-driver";
import {
    CarTableRow,
    DatabaseType,
    FuelTankTableRow,
    OdometerChangeLogTableRow,
    OdometerLogTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { ModelDao } from "./ModelDao.ts";
import { MakeDao } from "./MakeDao.ts";
import { CarMapper } from "../mapper/carMapper.ts";
import { FuelTankDao } from "../../_features/fuel/model/dao/FuelTankDao.ts";
import { Car } from "../../schemas/carSchema.ts";
import { FUEL_TANK_TABLE } from "../../../../database/connector/powersync/tables/fuelTank.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { SupabaseStorageAdapter } from "../../../../database/connector/storage/SupabaseStorageAdapter.ts";
import { CAR_TABLE } from "../../../../database/connector/powersync/tables/car.ts";
import { ODOMETER_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerLog.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { OdometerLogDao } from "../../_features/odometer/model/dao/OdometerLogDao.ts";
import { OdometerUnitDao } from "../../_features/odometer/model/dao/OdometerUnitDao.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";
import { ODOMETER_CHANGE_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerChangeLog.ts";

export class CarDao extends Dao<CarTableRow, Car, CarMapper> {
    private readonly storage: SupabaseStorageAdapter;
    private readonly attachmentQueue?: PhotoAttachmentQueue;

    constructor(
        db: Kysely<DatabaseType>,
        storage: SupabaseStorageAdapter,
        attachmentQueue?: PhotoAttachmentQueue,
        makeDao: MakeDao,
        modelDao: ModelDao,
        odometerLogDao: OdometerLogDao,
        odometerUnitDao: OdometerUnitDao,
        fuelTankDao: FuelTankDao,
        currencyDao: CurrencyDao
    ) {
        super(
            db,
            CAR_TABLE,
            new CarMapper(makeDao, modelDao, odometerLogDao, odometerUnitDao, fuelTankDao, currencyDao, attachmentQueue)
        );
        this.storage = storage;
        this.attachmentQueue = attachmentQueue;
    }

    async getAll(): Promise<Array<Car>> {
        const carRowArray: Array<CarTableRow> = await this.db
        .selectFrom(CAR_TABLE)
        .selectAll()
        .orderBy("created_at")
        .orderBy("name")
        .execute();

        return await this.mapper.toDtoArray(carRowArray);
    }

    async getCarCurrencyIdById(id: string): Promise<number | null> {
        const result = await this.db
        .selectFrom(CAR_TABLE)
        .select("currency_id")
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

        return result.currency_id;
    }

    async create(
        car: CarTableRow,
        odometerLog: OdometerLogTableRow,
        odometerChangeLog: OdometerChangeLogTableRow | null,
        fuelTank: FuelTankTableRow
    ): Promise<Car> {
        const insertedCar = await this.db.transaction().execute(async trx => {
            const carRow = await trx
            .insertInto(CAR_TABLE)
            .values(car)
            .returningAll()
            .executeTakeFirstOrThrow();

            await trx
            .insertInto(ODOMETER_LOG_TABLE)
            .values(odometerLog)
            .returning("id")
            .executeTakeFirstOrThrow();

            if(odometerChangeLog) {
                await trx
                .insertInto(ODOMETER_CHANGE_LOG_TABLE)
                .values(odometerChangeLog)
                .returning("id")
                .executeTakeFirstOrThrow();
            }

            await trx
            .insertInto(FUEL_TANK_TABLE)
            .values(fuelTank)
            .returning("id")
            .executeTakeFirstOrThrow();

            return carRow;
        });

        return await this.mapper.toDto(insertedCar);
    }

    async update(car: CarTableRow, fuelTank: FuelTankTableRow) {
        const updatedCar = await this.db.transaction().execute(async trx => {
            const carRow = await trx
            .updateTable(CAR_TABLE)
            .set(car)
            .where("id", "=", car.id)
            .returningAll()
            .executeTakeFirstOrThrow();

            await trx
            .updateTable(FUEL_TANK_TABLE)
            .set(fuelTank)
            .where("id", "=", fuelTank.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            return carRow;
        });

        return await this.mapper.toDto(updatedCar);
    }

    async delete(carId: string) {
        try {
            const car = await this.getById(carId);

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