import { Kysely, sql } from "@powersync/kysely-driver";
import {
    CarTableRow,
    CurrencyTableRow,
    DatabaseType,
    FuelTankTableRow,
    FuelTypeTableRow,
    FuelUnitTableRow,
    MakeTableRow,
    ModelTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { CarMapper } from "../mapper/carMapper.ts";
import { Car } from "../../schemas/carSchema.ts";
import { FUEL_TANK_TABLE } from "../../../../database/connector/powersync/tables/fuelTank.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { CAR_TABLE } from "../../../../database/connector/powersync/tables/car.ts";
import { ODOMETER_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerLog.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { OdometerUnitDao } from "../../_features/odometer/model/dao/OdometerUnitDao.ts";
import { ODOMETER_CHANGE_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerChangeLog.ts";
import { CarFormFields } from "../../schemas/form/carForm.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { SelectQueryBuilder } from "kysely";
import { MODEL_TABLE } from "../../../../database/connector/powersync/tables/model.ts";
import { MAKE_TABLE } from "../../../../database/connector/powersync/tables/make.ts";
import { CURRENCY_TABLE } from "../../../../database/connector/powersync/tables/currency.ts";
import { getUserLocalCurrency } from "../../../_shared/currency/utils/getUserLocalCurrency.ts";
import { FUEL_TYPE_TABLE } from "../../../../database/connector/powersync/tables/fuelType.ts";
import { FUEL_UNIT_TABLE } from "../../../../database/connector/powersync/tables/fuelUnit.ts";
import { ODOMETER_UNIT_TABLE } from "../../../../database/connector/powersync/tables/odometerUnit.ts";
import { SelectOdometerTableRow } from "../../_features/odometer/model/dao/OdometerLogDao.ts";
import { WithPrefix } from "../../../../types";
import { UseWatchedQueryItemProps } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { WatchQueryOptions } from "../../../../database/watcher/watcher.ts";
import { UseWatchedQueryCollectionProps } from "../../../../database/hooks/useWatchedQueryCollection.ts";
import { UseInfiniteQueryOptions } from "../../../../database/hooks/useInfiniteQuery.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";

export type SelectCarModelTableRow =
    Pick<CarTableRow, "id" | "name" | "model_year"> &
    WithPrefix<Pick<ModelTableRow, "id" | "name">, "model"> &
    WithPrefix<MakeTableRow, "make">

export type SelectCarTableRow =
    CarTableRow &
    WithPrefix<Omit<SelectOdometerTableRow, "log_id" | "log_car_id" | "unit_id">, "odometer"> &
    WithPrefix<Omit<CurrencyTableRow, "id">, "currency"> &
    WithPrefix<Pick<ModelTableRow, "name">, "model"> &
    WithPrefix<MakeTableRow, "make"> &
    WithPrefix<Pick<FuelTankTableRow, "id" | "capacity">, "fuel_tank"> &
    WithPrefix<FuelTypeTableRow, "fuel_type"> &
    WithPrefix<FuelUnitTableRow, "fuel_unit"> &
    { odometer_log_id: SelectOdometerTableRow["log_id"] | null };

export class CarDao extends Dao<CarTableRow, Car, CarMapper, SelectCarTableRow> {
    private readonly attachmentQueue?: PhotoAttachmentQueue;

    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        attachmentQueue: PhotoAttachmentQueue | undefined,
        odometerUnitDao: OdometerUnitDao
    ) {
        super(
            db,
            powersync,
            CAR_TABLE,
            new CarMapper(attachmentQueue, odometerUnitDao)
        );
        this.attachmentQueue = attachmentQueue;
    }

    selectQuery(id?: any | null): SelectQueryBuilder<DatabaseType, any, SelectCarTableRow> {
        const localCurrencyId = getUserLocalCurrency();

        let query = this.db
        .selectFrom(`${ CAR_TABLE } as car` as const)
        .innerJoin(`${ MODEL_TABLE } as model` as const, "model.id", "car.model_id")
        .innerJoin(`${ MAKE_TABLE } as make` as const, "make.id", "model.make_id")
        .innerJoin(`${ CURRENCY_TABLE } as curr` as const, (join) =>
            join.on(
                (eb) => eb.fn("coalesce", [
                    eb.ref("car.currency_id"),
                    eb.val(localCurrencyId)
                ]),
                "=",
                sql.ref("curr.id")
            )
        )
        .innerJoin(`${ FUEL_TANK_TABLE } as tank` as const, "tank.car_id", "car.id")
        .innerJoin(`${ FUEL_TYPE_TABLE } as f_type` as const, "f_type.id", "tank.type_id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as f_unit` as const, "f_unit.id", "tank.unit_id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as o_unit` as const, "o_unit.id", "car.odometer_unit_id")
        .selectAll("car")
        .select((eb) => [
            "model.name as model_name",
            "make.id as make_id",
            "make.name as make_name",
            "curr.key as currency_key",
            "curr.symbol as currency_symbol",
            "tank.id as fuel_tank_id",
            "tank.capacity as fuel_tank_capacity",
            "f_type.id as fuel_type_id",
            "f_type.key as fuel_type_key",
            "f_unit.id as fuel_unit_id",
            "f_unit.key as fuel_unit_key",
            "f_unit.short as fuel_unit_short",
            "f_unit.conversion_factor as fuel_unit_conversion_factor",
            "o_unit.key as odometer_unit_key",
            "o_unit.short as odometer_unit_short",
            "o_unit.conversion_factor as odometer_unit_conversion_factor",
            eb.selectFrom(`${ ODOMETER_LOG_TABLE } as o_log`)
            .select("o_log.id")
            .whereRef("o_log.car_id", "=", "car.id")
            .orderBy("o_log.value", "desc")
            .limit(1)
            .as("odometer_log_id"),
            eb.selectFrom(`${ ODOMETER_LOG_TABLE } as o_log`)
            .select("o_log.value")
            .whereRef("o_log.car_id", "=", "car.id")
            .orderBy("o_log.value", "desc")
            .limit(1)
            .as("odometer_log_value")
        ])
        .orderBy("car.created_at", "asc")
        .orderBy("car.name", "asc");

        if(id) query = query.where("car.id", "=", id);

        return query;
    }

    selectCarModelQuery(id?: any | null) {
        let query = this.db
        .selectFrom(`${ CAR_TABLE } as car` as const)
        .innerJoin(`${ MODEL_TABLE } as model` as const, "model.id", "car.model_id")
        .innerJoin(`${ MAKE_TABLE } as make` as const, "make.id", "model.make_id")
        .selectAll("car")
        .select([
            "model.id as model_id",
            "model.name as model_name",
            "make.id as make_id",
            "make.name as make_name"
        ]);

        if(id) query = query.where("car.id", "=", id);

        return query;
    }

    carWatchedQueryCollection(options?: WatchQueryOptions): UseWatchedQueryCollectionProps<Car> {
        return {
            query: this.selectQuery(),
            mapper: this.mapper.toDtoArray.bind(this.mapper),
            options: options
        };
    }

    carWatchedQueryItem(carId: string | null | undefined, options?: WatchQueryOptions): UseWatchedQueryItemProps<Car> {
        return {
            query: this.selectQuery(carId),
            mapper: this.mapper.toDto.bind(this.mapper),
            options: { queryOnce: true, enabled: !!carId, ...options }
        };
    }

    pickerInfiniteQuery(): UseInfiniteQueryOptions<ReturnType<CarDao["selectCarModelQuery"]>, PickerItemType> {
        return {
            baseQuery: this.selectCarModelQuery(),
            defaultCursorOptions: {
                cursor: [
                    { field: "car.created_at", order: "asc" },
                    { field: "car.name", order: "asc", toLowerCase: true },
                    { field: "car.id", order: "asc" }
                ],
                defaultOrder: "asc"
            },
            idField: "car.id",
            mappedItemId: "value",
            mapper: (entity) => this.mapper.toPickerItem(entity)
        };
    }

    async getAll(): Promise<Array<Car>> {
        const carRowArray = await this.selectQuery()
        .orderBy("t1.created_at")
        .orderBy("t1.name")
        .execute();

        return this.mapper.toDtoArray(carRowArray);
    }

    async getCarCurrencyIdById(id: string): Promise<number> {
        const result = await this.db
        .selectFrom(CAR_TABLE)
        .select("currency_id")
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

        return result.currency_id!;
    }

    async getCarOwnerById(id: string): Promise<string> {
        const result = await this.db
        .selectFrom(CAR_TABLE)
        .select("owner_id")
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

        return result.owner_id!;
    }

    async getCarImagePath(id: string): Promise<string | null> {
        const result = await this.db
        .selectFrom(CAR_TABLE)
        .select("image_url")
        .where("id", "=", id)
        .executeTakeFirst();

        return result?.image_url ?? null;
    }

    async createFromFormResult(formResult: CarFormFields) {
        const previousCarImagePath = await this.getCarImagePath(formResult.id);

        const { car, odometerLog, odometerChangeLog, fuelTank } = await this.mapper.formResultToCarEntities(
            formResult,
            previousCarImagePath,
            (new Date()).toISOString()
        );

        return await this.db.transaction().execute(async trx => {
            const result = await trx
            .insertInto(CAR_TABLE)
            .values(car)
            .returning("id")
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

            return result.id;
        });
    }

    async updateFromFormResult(formResult: CarFormFields) {
        const previousCarImagePath = await this.getCarImagePath(formResult.id);
        const { car, fuelTank } = await this.mapper.formResultToCarEntities(formResult, previousCarImagePath);

        return await this.db.transaction().execute(async trx => {
            const result = await trx
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

            return result.id;
        });
    }

    async delete(carId: string) {
        try {
            const car = await this.getById(carId);

            if(car?.imagePath && this.attachmentQueue) {
                await this.attachmentQueue.deleteFile(car.imagePath);
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