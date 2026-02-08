import { Dao } from "../../../../../../database/dao/Dao.ts";
import {
    DatabaseType,
    FuelLogTableRow,
    FuelUnitTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelLog } from "../../schemas/fuelLogSchema.ts";
import { FuelLogMapper } from "../mapper/fuelLogMapper.ts";
import { Kysely, SelectQueryBuilder, sql } from "kysely";
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
import {
    LineChartStatistics,
    StatisticsFunctionArgs,
    SummaryStatistics
} from "../../../../../../database/dao/types/statistics.ts";
import { FUEL_TANK_TABLE } from "../../../../../../database/connector/powersync/tables/fuelTank.ts";
import { formatDateToDatabaseFormat } from "../../../../../statistics/utils/formatDateToDatabaseFormat.ts";
import {
    getStatisticsAggregateQuery,
    StatisticsAggregateQueryResult
} from "../../../../../../database/dao/utils/getStatisticsAggregateQuery.ts";
import { formatSummaryStatistics } from "../../../../../../database/dao/utils/formatSummaryStatistics.ts";
import { getExtendedRange } from "../../../../../statistics/utils/getExtendedRange.ts";
import { ExtractRowFromQuery } from "../../../../../../database/hooks/useInfiniteQuery.ts";
import { UseWatchedQueryCollectionProps } from "../../../../../../database/hooks/useWatchedQueryCollection.ts";
import { ExpenseTypeEnum } from "../../../../../expense/model/enums/ExpenseTypeEnum.ts";
import {
    exchangedAmountExpression,
    odometerValueExpression,
    simpleConversionExpression
} from "../../../../../../database/dao/expressions";

export type SelectFuelLogTableRow =
    FuelLogTableRow
    & WithPrefix<Omit<SelectExpenseTableRow, "related_id" | "car_id" | "id" | keyof WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">>, "expense">
    & WithPrefix<Omit<FuelUnitTableRow, "id">, "fuel_unit">
    & WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">
    & Nullable<WithPrefix<Omit<SelectOdometerTableRow, "log_car_id">, "odometer">>

export type FuelConsumptionResult = ExtractRowFromQuery<ReturnType<FuelLogDao["fuelConsumptionQuery"]>>;
export type FuelCostPerDistanceResult = ExtractRowFromQuery<ReturnType<FuelLogDao["fuelCostPerDistanceQuery"]>>;

export class FuelLogDao extends Dao<FuelLogTableRow, FuelLog, FuelLogMapper, SelectFuelLogTableRow> {
    private readonly expenseDao: ExpenseDao;
    private readonly odometerLogDao: OdometerLogDao;

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

        this.expenseDao = expenseDao;
        this.odometerLogDao = odometerLogDao;
    }

    selectQuery(id?: any | null): SelectQueryBuilder<DatabaseType, any, SelectFuelLogTableRow> {
        return this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as fl` as const)
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "e.id", "fl.expense_id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as fu` as const, "fu.id", "fl.fuel_unit_id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "c.id", "fl.car_id")
        .innerJoin(`${ MODEL_TABLE } as mo` as const, "mo.id", "c.model_id")
        .innerJoin(`${ MAKE_TABLE } as ma` as const, "ma.id", "mo.make_id")
        .leftJoin(`${ ODOMETER_LOG_TABLE } as ol` as const, "ol.id", "fl.odometer_log_id")
        .leftJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "ou.id", "c.odometer_unit_id")
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as et` as const, "et.id", "e.type_id")
        .innerJoin(`${ CURRENCY_TABLE } as cur` as const, "cur.id", "e.currency_id")
        .innerJoin(`${ CURRENCY_TABLE } as ccur` as const, "ccur.id", "c.currency_id")
        .selectAll("fl")
        .select((eb) => [
            "e.amount as expense_amount",
            exchangedAmountExpression(
                eb,
                "e.amount",
                "e.exchange_rate"
            ).as("expense_exchanged_amount"),
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
            odometerValueExpression(
                eb,
                "ol.value",
                "ou.conversion_factor"
            ).as("odometer_log_value"),
            "ol.type_id as odometer_log_type_id",
            "ou.id as odometer_unit_id",
            "ou.key as odometer_unit_key",
            "ou.short as odometer_unit_short",
            "ou.conversion_factor as odometer_unit_conversion_factor"
        ])
        .$if(!!id, (qb) => qb.where("fl.id", "=", id!));
    };

    baseSummaryStatisticsQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        return this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as fl` as const)
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "fl.expense_id", "e.id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "e.car_id", "c.id")
        .innerJoin(`${ FUEL_TANK_TABLE } as ft` as const, "c.id", "ft.car_id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as fu` as const, "ft.unit_id", "fu.id")
        .where("e.date", ">=", formatDateToDatabaseFormat(from))
        .where("e.date", "<=", formatDateToDatabaseFormat(to))
        .$if(!!carId, (q: any) => q.where("c.id", "=", carId));
    }

    summaryStatisticsByAmountQuery(props: StatisticsFunctionArgs) {
        return this.expenseDao.summaryStatisticsQuery<number | null>({
            ...props,
            expenseType: ExpenseTypeEnum.FUEL,
            onlyRecordValue: true
        });
    }

    summaryStatisticsByQuantityQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        return getStatisticsAggregateQuery({
            db: this.db,
            baseQuery: this.baseSummaryStatisticsQuery({ carId, from, to }),
            idField: "fl.id",
            field: (eb) => simpleConversionExpression(eb, "fl.quantity", "fu.conversion_factor"),
            fromDateField: "e.date",
            from,
            to
        });
    }

    fuelConsumptionQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        const { extendedFrom, extendedTo } = getExtendedRange(from, to);

        const baseQuery = this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as fl` as const)
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "fl.expense_id", "e.id")
        .leftJoin(`${ ODOMETER_LOG_TABLE } as ol` as const, "fl.odometer_log_id", "ol.id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "e.car_id", "c.id")
        .innerJoin(`${ FUEL_TANK_TABLE } as ft` as const, "c.id", "ft.car_id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as fu` as const, "ft.unit_id", "fu.id")
        .leftJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "c.odometer_unit_id", "ou.id")
        .select((eb) => [
            "e.date",
            eb.fn.sum<number>(simpleConversionExpression(eb, "fl.quantity", "fu.conversion_factor")).as("quantity"),
            odometerValueExpression(eb, "ol.value", "ou.conversion_factor").as("odometer_value")
        ])
        .where("e.date", ">=", formatDateToDatabaseFormat(extendedFrom))
        .where("e.date", "<=", formatDateToDatabaseFormat(extendedTo))
        .$if(!!carId, (qb) => qb.where("c.id", "=", carId!))
        .groupBy(["e.date"])
        .orderBy("e.date", "asc");

        return this.db
        .with("base_logs", () => baseQuery)
        .with("steps", (db) => db
            .selectFrom("base_logs")
            .select((eb) => [
                //@formatter:off
                "date",
                "quantity",
                "odometer_value",
                sql<number>`LAG(${ eb.ref("odometer_value") }) OVER (ORDER BY ${ eb.ref("date") })`
                .as("prev_odometer_value")
                //@formatter:on
            ])
        )
        .selectFrom("steps")
        .select((eb) => {
            //@formatter:off
            const distance = eb("steps.odometer_value", "-", eb.ref("steps.prev_odometer_value"));

            const totalDistance = sql<number>`SUM(CASE WHEN ${ distance } > 0 THEN ${ distance } ELSE 0 END) OVER (ORDER BY ${ eb.ref("steps.date") })`;
            const totalQuantity = sql<number>`SUM(${ eb.ref("quantity") }) OVER (ORDER BY ${ eb.ref("steps.date") })`;

            return [
                "steps.date",
                sql<number>`ROUND((${totalQuantity} / NULLIF(${totalDistance}, 0)) * 100, 2)`.as("value")
            ];
            //@formatter:on
        })
        .where("steps.prev_odometer_value", "is not", null)
        .where((eb) => eb("steps.odometer_value", "-", eb.ref("steps.prev_odometer_value")), ">", 0)
        .where("steps.date", ">=", formatDateToDatabaseFormat(extendedFrom))
        .where("steps.date", "<=", formatDateToDatabaseFormat(extendedTo))
        .orderBy("steps.date", "asc");
    }

    fuelCostPerDistanceQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        const { extendedFrom, extendedTo } = getExtendedRange(from, to);

        const odometerStepsQuery = this.odometerLogDao.odometerQuery({ carId, from: extendedFrom, to: extendedTo })
        .select((eb) => {
            const odometerExpression = odometerValueExpression(eb, "ol.value", "ou.conversion_factor");
            const dateExpression = this.odometerLogDao.dateExpression(eb);

            return [
                //@formatter:off
                odometerExpression.as("odometer_value"),
                dateExpression.as("date"),
                sql<number>`LAG(${ odometerExpression }) OVER (ORDER BY ${ dateExpression })`.as("prev_odometer_value"),
                sql<string>`LAG(${ dateExpression }) OVER (ORDER BY ${ dateExpression })`.as("prev_date")
                //@formatter:on
            ];
        });

        return this.db
        .with("steps", () => odometerStepsQuery)
        .with("periods", (db) => db
            .selectFrom("steps")
            .select((eb) => [
                //@formatter:off
                "steps.date as date",
                sql<number>`
                    CAST(${ eb.ref("steps.odometer_value") } AS NUMERIC)
                    -
                    CAST(${ eb.ref("steps.prev_odometer_value") } AS NUMERIC)
                `.as("period_distance"),
                eb.selectFrom(`${ FUEL_LOG_TABLE } as ifl` as const)
                .innerJoin(`${ EXPENSE_TABLE } as ie` as const, "ifl.expense_id", "ie.id")
                .innerJoin(`${ CAR_TABLE } as ic` as const, "ie.car_id", "ic.id")
                .select((eb) =>
                    eb.fn.coalesce(
                        eb.fn.sum(
                            exchangedAmountExpression(
                                eb,
                                "ie.amount",
                                "ie.exchange_rate"
                            )
                        ),
                        eb.val(0)
                    ).as("period_cost")
                )
                .whereRef("ie.date", ">=", "steps.prev_date")
                .whereRef("ie.date", "<", "steps.date")
                .$if(!!carId, (qb) => qb.where("ie.car_id", "=", carId!))
                .as("period_cost")
            ])
            .where("steps.prev_date", "is not", null) // skip first or when date is null
        )
        .selectFrom((eb) => eb
            .selectFrom("periods")
            .select((eb) => {
                return [
                    //@formatter:off
                    "date",
                    sql<number>`ROUND((${ eb.ref("period_cost") } / NULLIF(${ eb.ref("period_distance") }, 0)) * 100, 2)`.as("value")
                    //@formatter:on
                ]
            })
            .as("aggregated")
        )
        .select([
            "date",
            "value"
        ])
        .where("value", ">", 0)
        .where("date", ">=", formatDateToDatabaseFormat(from))
        .where("date", "<=", formatDateToDatabaseFormat(to))
        .orderBy("date", "asc");
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

    summaryStatisticsByAmountWatchedQueryItem(props: StatisticsFunctionArgs): UseWatchedQueryItemProps<SummaryStatistics, StatisticsAggregateQueryResult<number | null>> {
        return {
            query: this.summaryStatisticsByAmountQuery(props),
            mapper: formatSummaryStatistics
        };
    }

    summaryStatisticsByQuantityWatchedQueryItem(props: StatisticsFunctionArgs): UseWatchedQueryItemProps<SummaryStatistics, StatisticsAggregateQueryResult> {
        return {
            query: this.summaryStatisticsByQuantityQuery(props),
            mapper: formatSummaryStatistics
        };
    }

    expensesByRangeStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs) {
        return this.expenseDao.groupedExpensesByRangeStatisticsWatchedQueryCollection({
            ...props,
            expenseType: ExpenseTypeEnum.FUEL
        });
    }

    fuelConsumptionStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs): UseWatchedQueryCollectionProps<LineChartStatistics, FuelConsumptionResult> {
        return {
            query: this.fuelConsumptionQuery(props),
            mapper: this.mapper.fuelConsumptionToLineChartStatistics.bind(this.mapper)
        };
    }

    fuelCostPerDistanceStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs): UseWatchedQueryCollectionProps<LineChartStatistics, FuelCostPerDistanceResult> {
        return {
            query: this.fuelCostPerDistanceQuery(props),
            mapper: this.mapper.fuelCostPerDistanceToLineChartStatistics.bind(this.mapper)
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