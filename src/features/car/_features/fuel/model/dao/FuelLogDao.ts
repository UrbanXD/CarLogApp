import { Dao } from "../../../../../../database/dao/Dao.ts";
import {
    DatabaseType,
    FuelLogTableRow,
    FuelUnitTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelLog } from "../../schemas/fuelLogSchema.ts";
import { FuelLogMapper } from "../mapper/fuelLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ExpenseTypeDao } from "../../../../../expense/model/dao/ExpenseTypeDao.ts";
import { FuelUnitDao } from "./FuelUnitDao.ts";
import { FUEL_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/fuelLog.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";
import { OdometerLogDao, SelectOdometerTableRow } from "../../../odometer/model/dao/OdometerLogDao.ts";
import { FuelLogFormFields } from "../../schemas/form/fuelLogForm.ts";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { OdometerUnitDao } from "../../../odometer/model/dao/OdometerUnitDao.ts";
import { ExpenseDao } from "../../../../../expense/model/dao/ExpenseDao.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { SelectQueryBuilder } from "kysely";
import { SelectExpenseTableRow } from "../../../../../expense/model/mapper/expenseMapper.ts";
import { SelectCarModelTableRow } from "../../../../model/dao/CarDao.ts";
import { Nullable, WithPrefix } from "../../../../../../types";
import { FUEL_UNIT_TABLE } from "../../../../../../database/connector/powersync/tables/fuelUnit.ts";
import { CAR_TABLE } from "../../../../../../database/connector/powersync/tables/car.ts";
import { EXPENSE_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/expenseType.ts";
import { CURRENCY_TABLE } from "../../../../../../database/connector/powersync/tables/currency.ts";
import { ODOMETER_UNIT_TABLE } from "../../../../../../database/connector/powersync/tables/odometerUnit.ts";
import { MAKE_TABLE } from "../../../../../../database/connector/powersync/tables/make.ts";
import { MODEL_TABLE } from "../../../../../../database/connector/powersync/tables/model.ts";
import { WatchQueryOptions } from "../../../../../../database/watcher/watcher.ts";
import { UseWatchedQueryItemProps } from "../../../../../../database/hooks/useWatchedQueryItem.ts";

export type SelectFuelLogTableRow =
    FuelLogTableRow
    & WithPrefix<Omit<SelectExpenseTableRow, "related_id" | "car_id" | "id" | keyof WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">>, "expense">
    & WithPrefix<Omit<FuelUnitTableRow, "id">, "fuel_unit">
    & WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">
    & Nullable<WithPrefix<Omit<SelectOdometerTableRow, "log_car_id">, "odometer">>

export class FuelLogDao extends Dao<FuelLogTableRow, FuelLog, FuelLogMapper, SelectFuelLogTableRow> {
    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        fuelUnitDao: FuelUnitDao,
        expenseDao: ExpenseDao,
        expenseTypeDao: ExpenseTypeDao,
        odometerLogDao: OdometerLogDao,
        odometerUnitDao: OdometerUnitDao
    ) {
        super(
            db,
            powersync,
            FUEL_LOG_TABLE,
            new FuelLogMapper(fuelUnitDao, expenseDao, expenseTypeDao, odometerLogDao, odometerUnitDao)
        );
    }

    selectQuery(id?: any | null): SelectQueryBuilder<DatabaseType, any, SelectFuelLogTableRow> {
        let query = this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as fl` as const)
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "e.id", "fl.expense_id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as fu` as const, "fu.id", "fl.fuel_unit_id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "c.id", "fl.car_id")
        .innerJoin(`${ MODEL_TABLE } as mo` as const, "mo.id", "c.model_id")
        .innerJoin(`${ MAKE_TABLE } as ma` as const, "ma.id", "mo.make_id")
        .leftJoin(`${ ODOMETER_LOG_TABLE } as ol` as const, "ol.id", "fl.odometer_log_id")
        .leftJoin(`${ ODOMETER_UNIT_TABLE } as u` as const, "u.id", "c.odometer_unit_id")
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as et` as const, "et.id", "e.type_id")
        .innerJoin(`${ CURRENCY_TABLE } as cur` as const, "cur.id", "e.currency_id")
        .innerJoin(`${ CURRENCY_TABLE } as ccur` as const, "ccur.id", "c.currency_id")
        .selectAll("fl")
        .select([
            "e.amount as expense_amount",
            "e.original_amount as expense_original_amount",
            "e.exchange_rate as expense_exchange_rate",
            "e.date as expense_date",
            "e.note as expense_note",
            "et.id as expense_type_id",
            "et.key as expense_type_key",
            "et.owner_id as expense_type_owner_id",
            "cur.id as expense_currency_id",
            "cur.symbol as expense_currency_symbol",
            "cur.key as expense_currency_key",
            "ccur.id as expense_car_currency_id",
            "ccur.symbol as expense_car_currency_symbol",
            "ccur.key as expense_car_currency_key",
            "fu.key as fuel_unit_key",
            "fu.short as fuel_unit_short",
            "fu.conversion_factor as fuel_unit_conversion_factor",
            "c.name as car_name",
            "mo.id as car_model_id",
            "mo.name as car_model_name",
            "c.model_year as car_model_year",
            "ma.id as car_make_id",
            "ma.name as car_make_name",
            "ol.value as odometer_log_value",
            "ol.type_id as odometer_log_type_id",
            "u.id as odometer_unit_id",
            "u.key as odometer_unit_key",
            "u.short as odometer_unit_short",
            "u.conversion_factor as odometer_unit_conversion_factor"
        ]);

        if(id) query = query.where("fl.id", "=", id);

        return query;
    }

    fuelLogWatchedQueryItem(
        id: string | null | undefined,
        options?: WatchQueryOptions
    ): UseWatchedQueryItemProps<FuelLog> {
        return {
            query: this.selectQuery(id),
            mapper: this.mapper.toDto.bind(this.mapper),
            options: { enabled: !!id, ...options }
        };
    }

    async createFromFormResult(formResult: FuelLogFormFields): Promise<FuelLog | null> {
        const { expense, fuelLog, odometerLog } = await this.mapper.formResultToEntities(formResult);

        const insertedFuelLogId = await this.db.transaction().execute(async trx => {
            await trx
            .insertInto(EXPENSE_TABLE)
            .values(expense)
            .returning("id")
            .executeTakeFirstOrThrow();

            if(odometerLog) {
                await trx
                .insertInto(ODOMETER_LOG_TABLE)
                .values(odometerLog)
                .returning("id")
                .executeTakeFirstOrThrow();
            }

            const result = await trx
            .insertInto(FUEL_LOG_TABLE)
            .values(fuelLog)
            .returning("id")
            .executeTakeFirstOrThrow();

            return result.id;
        });

        return await this.getById(insertedFuelLogId);
    }

    async updateFromFormResult(formResult: FuelLogFormFields): Promise<FuelLog | null> {
        const { expense, fuelLog, odometerLog } = await this.mapper.formResultToEntities(formResult);

        const updatedFuelLogId = await this.db.transaction().execute(async trx => {
            await trx
            .updateTable(EXPENSE_TABLE)
            .set(expense)
            .where("id", "=", expense.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            const originalFuelLog = await trx
            .selectFrom(FUEL_LOG_TABLE)
            .select("odometer_log_id as odometerLogId")
            .where("id", "=", fuelLog.id)
            .executeTakeFirst();

            if(originalFuelLog?.odometerLogId && !odometerLog) {
                await trx
                .deleteFrom(ODOMETER_LOG_TABLE)
                .where("id", "=", originalFuelLog.odometerLogId)
                .returning("id")
                .executeTakeFirstOrThrow();
            } else if(odometerLog) {
                if(originalFuelLog?.odometerLogId === odometerLog.id) {
                    await trx
                    .updateTable(ODOMETER_LOG_TABLE)
                    .set(odometerLog)
                    .where("id", "=", odometerLog.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                } else {
                    await trx
                    .insertInto(ODOMETER_LOG_TABLE)
                    .values(odometerLog)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const result = await trx
            .updateTable(FUEL_LOG_TABLE)
            .set(fuelLog)
            .where("id", "=", fuelLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            return result.id;
        });

        return await this.getById(updatedFuelLogId);
    }

    async deleteLog(fuelLog: FuelLog): Promise<string | number> {
        return await this.db.transaction().execute(async trx => {
            const result = await trx
            .deleteFrom(FUEL_LOG_TABLE)
            .where("id", "=", fuelLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .deleteFrom(EXPENSE_TABLE)
            .where("id", "=", fuelLog.expense.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            if(!!fuelLog.odometer) {
                await trx
                .deleteFrom(ODOMETER_LOG_TABLE)
                .where("id", "=", fuelLog.odometer.id)
                .returning("id")
                .executeTakeFirstOrThrow();
            }

            return result.id;
        });
    }
}