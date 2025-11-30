import { Kysely, QueryCreator, sql } from "kysely";
import { DatabaseType } from "../../../../database/connector/powersync/AppSchema.ts";
import { FUEL_LOG_TABLE } from "../../../../database/connector/powersync/tables/fuelLog.ts";
import { EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/expense.ts";
import { ODOMETER_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerLog.ts";
import { ODOMETER_CHANGE_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerChangeLog.ts";
import { numberToFractionDigit } from "../../../../utils/numberToFractionDigit.ts";
import { FUEL_UNIT_TABLE } from "../../../../database/connector/powersync/tables/fuelUnit.ts";
import { CAR_TABLE } from "../../../../database/connector/powersync/tables/car.ts";
import { ODOMETER_UNIT_TABLE } from "../../../../database/connector/powersync/tables/odometerUnit.ts";
import { RIDE_LOG_TABLE } from "../../../../database/connector/powersync/tables/rideLog.ts";
import { RIDE_PLACE_TABLE } from "../../../../database/connector/powersync/tables/ridePlace.ts";
import { PLACE_TABLE } from "../../../../database/connector/powersync/tables/place.ts";
import { SERVICE_LOG_TABLE } from "../../../../database/connector/powersync/tables/serviceLog.ts";
import { LineChartItem } from "../../components/charts/LineChartView.tsx";
import { BarChartItem } from "../../components/charts/BarChartView.tsx";
import { ExpenseTypeDao } from "../../../expense/model/dao/ExpenseTypeDao.ts";
import { calculateTrend, Trend, TrendOptions } from "../../utils/calculateTrend.ts";
import { getRangeUnit, RangeUnit } from "../../utils/getRangeUnit.ts";
import { getPreviousRangeWindow } from "../../utils/getPreviousRangeWindow.ts";
import { LegendData } from "../../components/charts/common/Legend.tsx";
import { DonutChartItem } from "../../components/charts/DonutChartView.tsx";
import { EXPENSE_TYPE_TABLE } from "../../../../database/connector/powersync/tables/expenseType.ts";
import { ExpenseTypeEnum } from "../../../expense/model/enums/ExpenseTypeEnum.ts";
import { COLORS } from "../../../../constants/index.ts";
import { SERVICE_ITEM_TABLE } from "../../../../database/connector/powersync/tables/serviceItem.ts";
import { ServiceItemTypeDao } from "../../../expense/_features/service/model/dao/ServiceItemTypeDao.ts";
import { ServiceTypeDao } from "../../../expense/_features/service/model/dao/ServiceTypeDao.ts";

type StatisticsFunctionArgs = {
    carId?: string
    from: string
    to: string
    trendOptions?: TrendOptions
}

export type Stat = {
    value: string | number
    label: string
    color?: string
}

export type TrendStat = {
    max: number
    min: number
    average: number
    previousCycleAverage: number
    lineChartData: Array<LineChartItem>
}

export type ComparisonStatByType = {
    donutChartData: Array<DonutChartItem>
    legend: { [key: string]: LegendData }
}

export type ComparisonStatByDate = {
    barChartData: Array<BarChartItem>
    barChartTypes: { [key: string]: LegendData }
    rangeUnit: RangeUnit
}

export type TotalComparisonStat = {
    max: Stat
    min: Stat
    total: number
    average: number
    previousWindowTotal?: number
    previousWindowAverage?: number
    totalTrend: Trend
    averageTrend: Trend
}

export type TopListItemStat = {
    name: string,
    count: number
}

export type StatFunctionOptions = {
    carId?: string | null,
    type?: "year" | "month"
}

export const formatDate = (options?: {
    base?: string
    startOf?: "month" | "year" | "day",
    offset?: { months?: number, days?: number, years?: number },
    format?: string
}): string => {
    let baseDate = `${ options?.base ?? "'now'" }`;
    let startOf = options?.startOf ? `, 'start of ${ options.startOf }'` : "";
    let offset = "";
    if(options?.offset) {
        if(options.offset.months) offset += `, '${ options.offset.months } month'`;
        if(options.offset.days) offset += `, '${ options.offset.days } day'`;
        if(options.offset.years) offset += `, '${ options.offset.years } year'`;
    }

    return `strftime('${ options?.format ?? "%Y-%m-%d" }', ${ baseDate }${ startOf }${ offset })`;
};

const nowYear = formatDate({ format: "%Y" });
const previousYear = formatDate({ format: "%Y", offset: { years: -1 } });
const lastTowYear = formatDate({ startOf: "year", offset: { years: -2 } });

const nowMonth = formatDate({ format: "%Y-%m" });
const previousMonth = formatDate({ format: "%Y-%m", offset: { months: -1 } });
const lastTowMonth = formatDate({ startOf: "month", offset: { months: -2 } });

const currentYearDate = (base?: string) => formatDate({ base: base, format: "%Y" });
const currentMonthDate = (base?: string) => formatDate({ base: base, format: "%Y-%m" });

function getTrendDateLimit(dateField: string, dateType?: "year" | "month") {
    //@formatter:off
    let currentTrendDateLimit = sql.raw("1=1"); //true
    let previousTrendDateLimit = sql.raw("0=1"); //false
    let dateLimitSql;

    switch(dateType) {
        case "year":
            currentTrendDateLimit = sql.raw(`${ currentYearDate(dateField) } = ${ nowYear }`);
            break;
        case "month":
            currentTrendDateLimit = sql.raw(`${ currentMonthDate(dateField) } = ${ nowMonth }`);
            break;
    }

    switch(dateType) {
        case "year":
            previousTrendDateLimit = sql.raw(`${ currentYearDate(dateField) } = ${ previousYear }`);
            break;
        case "month":
            previousTrendDateLimit = sql.raw(`${ currentMonthDate(dateField) } = ${ previousMonth }`);
            break;
    }

    switch(dateType) {
        case "year":
            dateLimitSql = sql.raw(lastTowYear);
            break;
        case "month":
            dateLimitSql = sql.raw(lastTowMonth);
            break;
    }
    //@formatter:on

    return { currentTrendDateLimit, previousTrendDateLimit, dateLimitSql };
}

function getTopDateLimit(dateField: string, dateType?: "year" | "month" | "day") {
    let limit;

    switch(dateType) {
        case "year":
            limit = sql.raw(nowYear);
            break;
        case "month":
            limit = sql.raw(nowMonth);
            break;
    }

    return limit;
}

export class StatisticsDao {
    private db: Kysely<DatabaseType>;
    private readonly expenseTypeDao: ExpenseTypeDao;
    private readonly serviceTypeDao: ServiceTypeDao;
    private readonly serviceItemTypeDao: ServiceItemTypeDao;

    constructor(
        db: Kysely<DatabaseType>,
        expenseTypeDao: ExpenseTypeDao,
        serviceTypeDao: ServiceTypeDao,
        serviceItemTypeDao: ServiceItemTypeDao
    ) {
        this.db = db;
        this.expenseTypeDao = expenseTypeDao;
        this.serviceTypeDao = serviceTypeDao;
        this.serviceItemTypeDao = serviceItemTypeDao;
    }

    async getFuelCostTrend({ carId, type }: StatFunctionOptions): Promise<TrendStat> {
        const { currentTrendDateLimit, previousTrendDateLimit, dateLimitSql } = getTrendDateLimit("t2.date", type);

        let query = this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as t1`)
        .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
        .select([
            //@formatter:off
            sql<number>`SUM(CASE WHEN ${ currentTrendDateLimit } THEN t2.amount ELSE 0 END)`
            .as("current"),
            sql<number>`SUM(CASE WHEN ${ previousTrendDateLimit } THEN t2.amount ELSE 0 END)`
            .as("previous")
            //@formatter:on
        ]);

        if(carId) query = query.where("t2.car_id", "=", carId);
        if(dateLimitSql) query = query.where("t2.date", ">=", dateLimitSql);

        const result = await query.executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as TrendStat;
    }

    async getServiceCostTrend({ carId, type }: StatFunctionOptions): Promise<TrendStat> {
        const { currentTrendDateLimit, previousTrendDateLimit, dateLimitSql } = getTrendDateLimit("t2.date", type);

        let query = this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as t1`)
        .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
        .select([
            //@formatter:off
            sql<number>`SUM(CASE WHEN ${ currentTrendDateLimit } THEN t2.amount ELSE 0 END)`
            .as("current"),
            sql<number>`SUM(CASE WHEN ${ previousTrendDateLimit } THEN t2.amount ELSE 0 END)`
            .as("previous")
            //@formatter:on
        ]);

        if(carId) query = query.where("t2.car_id", "=", carId);
        if(dateLimitSql) query = query.where("t2.date", ">=", dateLimitSql);

        const result = await query.executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as TrendStat;
    }

    async getTotalCostTrend({ carId, type }: StatFunctionOptions): Promise<TrendStat> {
        const { currentTrendDateLimit, previousTrendDateLimit, dateLimitSql } = getTrendDateLimit("date", type);

        let query = this.db
        .selectFrom(EXPENSE_TABLE)
        .select([
            //@formatter:off
            sql<number>`SUM(CASE WHEN ${ currentTrendDateLimit } THEN amount ELSE 0 END)`
            .as("current"),
            sql<number>`SUM(CASE WHEN ${ previousTrendDateLimit } THEN amount ELSE 0 END)`
            .as("previous")
            //@formatter:on
        ])

        if(carId) query = query.where("car_id", "=", carId);
        if(dateLimitSql) query = query.where("date", ">=", dateLimitSql);

        const result = await query.executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as TrendStat;
    }

    async getDistanceTrend({ carId, type }: StatFunctionOptions): Promise<TrendStat> {
        const { currentTrendDateLimit, previousTrendDateLimit } = getTrendDateLimit("t2.date", type);

        let currQuery = (db: QueryCreator<DatabaseType>) => {
            let query = db
            .selectFrom(`${ ODOMETER_LOG_TABLE } as t1`)
            .innerJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as t2`, "t1.id", "t2.odometer_log_id")
            .innerJoin(`${ CAR_TABLE } as t3`, "t1.car_id", "t3.id")
            .innerJoin(`${ ODOMETER_UNIT_TABLE } as t4`, "t3.odometer_unit_id", "t4.id")
            .select([
                sql<number>`MIN(ROUND(t1.value / t4.conversion_factor))`.as("min"),
                sql<number>`MAX(ROUND(t1.value / t4.conversion_factor))`.as("max")
            ]);

            if(carId) query = query.where("t1.car_id", "=", carId);
            if(currentTrendDateLimit) query = query.where(currentTrendDateLimit);

            return query;
        };

        let prevQuery = (db: QueryCreator<DatabaseType>) => {
            let query = db
            .selectFrom(`${ ODOMETER_LOG_TABLE } as t1`)
            .innerJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as t2`, "t1.id", "t2.odometer_log_id")
            .innerJoin(`${ CAR_TABLE } as t3`, "t1.car_id", "t3.id")
            .innerJoin(`${ ODOMETER_UNIT_TABLE } as t4`, "t3.odometer_unit_id", "t4.id")
            .select([
                sql<number>`MIN(ROUND(t1.value / t4.conversion_factor))`.as("min"),
                sql<number>`MAX(ROUND(t1.value / t4.conversion_factor))`.as("max")
            ]);

            if(carId) query = query.where("t1.car_id", "=", carId);
            if(previousTrendDateLimit) query = query.where(previousTrendDateLimit);

            return query;
        };

        const result = await this.db
        .with("curr", (db) => currQuery(db))
        .with("prev", (db) => prevQuery(db))
        .selectFrom("curr")
        .select([
            sql<number>`COALESCE(curr.max - curr.min, 0)`.as("current"),
            sql<number>`COALESCE((SELECT prev.max - prev.min FROM prev), 0)`.as("previous")
        ])
        .executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as TrendStat;
    }

    async getFuelConsumption({ carId, type }: StatFunctionOptions): Promise<TrendStat> {
        const distance = await this.getDistanceTrend({ carId: carId, type: type });

        const { currentTrendDateLimit, previousTrendDateLimit, dateLimitSql } = getTrendDateLimit("t2.date", type);

        let query = this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as t1`)
        .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as t3`, "t3.id", "t1.fuel_unit_id")
        .select([
            //@formatter:off
            sql<number>`SUM(CASE WHEN ${ currentTrendDateLimit } THEN t1.quantity * t3.conversion_factor ELSE 0 END)`
            .as("current"),
            sql<number>`SUM(CASE WHEN ${ previousTrendDateLimit } THEN t1.quantity * t3.conversion_factor ELSE 0 END)`
            .as("previous")
            //@formatter:on
        ]);

        if(carId) query = query.where("t2.car_id", "=", carId);
        if(dateLimitSql) query = query.where("t2.date", ">=", dateLimitSql);

        const fuelQuantity = await query.executeTakeFirst();

        let current = 0;
        if(fuelQuantity?.current && fuelQuantity.current !== 0 && distance.current !== 0) {
            current = numberToFractionDigit((fuelQuantity.current / distance.current) * 100);
        }

        let previous = 0;
        if(fuelQuantity?.previous && fuelQuantity.previous !== 0 && distance.previous !== 0) {
            previous = numberToFractionDigit((fuelQuantity.previous / distance.previous) * 100);
        }

        return { current, previous } as TrendStat;
    }

    async getCostPerDistance(options: StatFunctionOptions): Promise<TrendStat> {
        const totalCost = await this.getTotalCostTrend(options);
        const distance = await this.getDistanceTrend(options);

        return {
            current: distance.current === 0
                     ? 0
                     : numberToFractionDigit((totalCost.current / distance.current) * 100),
            previous: distance.previous === 0
                      ? 0
                      : numberToFractionDigit((totalCost.previous / distance.previous) * 100)
        } as TrendStat;
    }

    async getLongestRideDistance({ carId, type }: StatFunctionOptions): Promise<TrendStat> {
        const { currentTrendDateLimit, previousTrendDateLimit, dateLimitSql } = getTrendDateLimit(
            "t1.start_time",
            type
        );

        let query = this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t2`, "t1.start_odometer_log_id", "t2.id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t3`, "t1.end_odometer_log_id", "t3.id")
        .innerJoin(`${ CAR_TABLE } as t4`, "t1.car_id", "t4.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t5`, "t4.odometer_unit_id", "t5.id")
        .select([
            //@formatter:off
            sql<number>`MAX(CASE WHEN ${ currentTrendDateLimit } THEN (ROUND((t3.value - t2.value) / t5.conversion_factor)) ELSE 0 END)`
            .as("current"),
            sql<number>`MAX(CASE WHEN ${ previousTrendDateLimit } THEN (ROUND((t3.value - t2.value) / t5.conversion_factor)) ELSE 0 END)`
            .as("previous")
            //@formatter:on
        ])

        if(carId) query = query.where("t1.car_id", "=", carId);
        if(dateLimitSql) query = query.where("t1.start_time", ">=", dateLimitSql);

        const result = await query.executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as TrendStat;
    }

    async getAverageRideDistance({ carId, type }: StatFunctionOptions): Promise<TrendStat> {
        const { currentTrendDateLimit, previousTrendDateLimit, dateLimitSql } = getTrendDateLimit(
            "t1.start_time",
            type
        );

        let query = this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t2`, "t1.start_odometer_log_id", "t2.id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t3`, "t1.end_odometer_log_id", "t3.id")
        .innerJoin(`${ CAR_TABLE } as t4`, "t1.car_id", "t4.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t5`, "t4.odometer_unit_id", "t5.id")
        .select([
            //@formatter:off
            sql<number>`AVG(CASE WHEN ${ currentTrendDateLimit } THEN ROUND((t3.value - t2.value) / t5.conversion_factor) ELSE 0 END)`
            .as("current"),
            sql<number>`AVG(CASE WHEN ${ previousTrendDateLimit } THEN ROUND((t3.value - t2.value) / t5.conversion_factor) ELSE 0 END)`
            .as("previous")
            //@formatter:on
        ]);

        if(carId) query = query.where("t1.car_id", "=", carId);
        if(dateLimitSql) query = query.where("t1.start_time", ">=", dateLimitSql);

        const result = await query.executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as TrendStat;
    }

    async getLongestRideDuration({ carId, type }: StatFunctionOptions): Promise<TrendStat> {
        const { currentTrendDateLimit, previousTrendDateLimit, dateLimitSql } = getTrendDateLimit(
            "t1.start_time",
            type
        );

        let query = this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as t1`)
        .select([
            //@formatter:off
            sql<number>`MAX(CASE WHEN ${ currentTrendDateLimit } THEN (julianday(t1.end_time) - julianday(t1.start_time)) * 86400 ELSE 0 END)`
            .as("current"),
            sql<number>`MAX(CASE WHEN ${ previousTrendDateLimit } THEN (julianday(t1.end_time) - julianday(t1.start_time)) * 86400 ELSE 0 END)`
            .as("previous")
            //@formatter:on
        ])

        if(carId) query = query.where("t1.car_id", "=", carId);
        if(dateLimitSql) query = query.where("t1.start_time", ">=", dateLimitSql);

        const result = await query.executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as TrendStat;
    }

    async getAverageRideDuration({ carId, type }: StatFunctionOptions): Promise<TrendStat> {
        const { currentTrendDateLimit, previousTrendDateLimit, dateLimitSql } = getTrendDateLimit(
            "t1.start_time",
            type
        );

        let query = this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as t1`)
        .select([
            //@formatter:off
            sql<number>`AVG(CASE WHEN ${ currentTrendDateLimit } THEN (julianday(t1.end_time) - julianday(t1.start_time)) * 86400 ELSE 0 END)`
            .as("current"),
            sql<number>`AVG(CASE WHEN ${ previousTrendDateLimit } THEN (julianday(t1.end_time) - julianday(t1.start_time)) * 86400 ELSE 0 END)`
            .as("previous")
            //@formatter:on
        ])

        if(carId) query = query.where("t1.car_id", "=", carId);
        if(dateLimitSql) query = query.where("t1.start_time", ">=", dateLimitSql);

        const result = await query.executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as TrendStat;
    }

    async getTopVisitedPlaces({ carId, type }: StatFunctionOptions): Promise<Array<TopListItemStat>> {
        const dateLimit = getTopDateLimit("t2.start_time", type);

        let query = this.db
        .selectFrom(`${ RIDE_PLACE_TABLE } as t1`)
        .innerJoin(`${ RIDE_LOG_TABLE } as t2`, "t1.ride_log_id", "t2.id")
        .innerJoin(`${ PLACE_TABLE } as t3`, "t1.place_id", "t3.id")
        .select((eb) => [
            "t3.name",
            eb.fn.count("t1.id").as("count")
        ])
        .groupBy("t3.id")
        .orderBy("count", "desc")
        .limit(3);

        if(carId) query = query.where("t2.car_id", "=", carId);
        if(dateLimit) query = query.where("t2.start_time", ">=", dateLimit);

        return await query.execute();
    }

    private getRangeGroupByExpression(fieldName: string, unit: RangeUnit) {
        //@formatter:off
        switch(unit) {
            case "hour":
                return sql`strftime('%Y-%m-%d %H:00:00', ${ sql.raw(fieldName) })`;
            case "day":
                return sql`strftime('%Y-%m-%d', ${ sql.raw(fieldName) })`;
            case "month":
                return sql`strftime('%Y-%m', ${ sql.raw(fieldName) })`;
            case "year":
                return sql`strftime('%Y', ${ sql.raw(fieldName) })`;
        }
        //@formatter:on
    }

    private getRangeSelectExpression(fieldName: string, unit: RangeUnit) {
        //@formatter:off
        switch(unit) {
            case "hour":
                return sql`strftime('%Y-%m-%d %H:00:00', ${ sql.raw(fieldName) })`.as("time");
            case "day":
                return sql`strftime('%Y-%m-%d', ${ sql.raw(fieldName) })`.as("time");
            case "month":
                return sql`strftime('%Y-%m', ${ sql.raw(fieldName) })`.as("time");
            case "year":
                return sql`strftime('%Y', ${ sql.raw(fieldName) })`.as("time");
        }
        //@formatter:on
    }

    async getExpenseTotalComparison({
        carId,
        from,
        to,
        trendOptions,
        expenseType
    }: StatisticsFunctionArgs & { expenseType?: ExpenseTypeEnum }): Promise<TotalComparisonStat> {
        let expenseTypeId = null;
        if(expenseType) expenseTypeId = await this.expenseTypeDao.getIdByKey(expenseType);

        let maxItemQuery = this.db
        .selectFrom(`${ EXPENSE_TABLE } as t1`)
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as t2`, "t1.type_id", "t2.id")
        .select([
            "t1.amount",
            "t2.id as type_id",
            "t2.owner_id as owner_id",
            "t2.key as key"
        ])
        .where("date", ">=", from)
        .where("date", "<=", to)
        .orderBy("amount", "desc")
        .limit(1);

        if(carId) maxItemQuery = maxItemQuery.where("t1.car_id", "=", carId);
        if(expenseTypeId) maxItemQuery = maxItemQuery.where("t1.type_id", "=", expenseTypeId);

        const maxItemResult = await maxItemQuery.executeTakeFirst();
        const selectedExpenseType = await this.expenseTypeDao.mapper.toDto({
            id: maxItemResult.type_id,
            owner_id: maxItemResult.owner_id,
            key: maxItemResult.key
        });

        const { from: previousWindowFrom, to: previousWindowTo } = getPreviousRangeWindow(from, to);

        let aggregateQuery = this.db
        .selectFrom(EXPENSE_TABLE)
        .select([
            sql<number>`AVG(amount) as average`,
            sql<number>`SUM(amount) as total`
        ])
        .where("date", ">=", from)
        .where("date", "<=", to);

        let previousWindowAggregateQuery = this.db
        .selectFrom(EXPENSE_TABLE)
        .select([
            sql<number>`AVG(amount) as average`,
            sql<number>`SUM(amount) as total`
        ])
        .where("date", ">=", previousWindowFrom)
        .where("date", "<=", previousWindowTo);

        if(carId) {
            aggregateQuery = aggregateQuery.where("car_id", "=", carId);
            previousWindowAggregateQuery = previousWindowAggregateQuery.where("car_id", "=", carId);
        }

        if(expenseTypeId) {
            aggregateQuery = aggregateQuery.where("type_id", "=", expenseTypeId);
            previousWindowAggregateQuery = previousWindowAggregateQuery.where("type_id", "=", expenseTypeId);
        }

        const averageResult = await aggregateQuery.executeTakeFirst();
        const previousWindowAverageResult = await previousWindowAggregateQuery.executeTakeFirst();

        const total = numberToFractionDigit(averageResult.total ?? 0);
        const average = numberToFractionDigit(averageResult.average ?? 0);
        const previousWindowTotal = numberToFractionDigit(previousWindowAverageResult.total ?? 0);
        const previousWindowAverage = numberToFractionDigit(previousWindowAverageResult.average ?? 0);

        return {
            max: {
                value: numberToFractionDigit(maxItemResult?.amount ?? 0),
                label: maxItemResult?.key ?? ExpenseTypeEnum.OTHER,
                color: selectedExpenseType.primaryColor
            },
            total,
            average,
            previousWindowTotal,
            previousWindowAverage,
            totalTrend: calculateTrend(total, previousWindowTotal, trendOptions),
            averageTrend: calculateTrend(average, previousWindowAverage, trendOptions)
        };
    }

    async getExpenseComparisonByType({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByType> {
        let query = this.db
        .selectFrom(EXPENSE_TABLE)
        .select([
            sql<number>`SUM(amount) as total`,
            sql<number>`SUM(amount) * 100.0 / SUM(SUM(amount)) OVER () as percent`,
            "type_id"
        ])
        .where("date", ">=", from)
        .where("date", "<=", to)
        .groupBy("type_id")
        .orderBy("total", "desc");

        if(carId) query = query.where("car_id", "=", carId);

        const result = await query.execute();

        const expenseTypes = await this.expenseTypeDao.getAll();
        const legend: { [key: string]: LegendData } = {};
        expenseTypes.forEach((t) => {
            legend[t.id] = {
                label: t.key,
                color: t.primaryColor
            };
        });

        const typesInChart: Set<string> = new Set();

        const donutChartData: Array<DonutChartItem> = result.map((r, index) => {
            typesInChart.add(r.type_id);

            return {
                value: numberToFractionDigit(r.percent),
                label: legend[r.type_id].label,
                description: numberToFractionDigit(r.total),
                color: legend[r.type_id].color,
                focused: index === 0
            };
        });

        const filteredLegend: { [key: string]: LegendData } = {};

        typesInChart.forEach((typeId) => {
            filteredLegend[typeId] = legend[typeId];
        });

        return {
            donutChartData,
            legend: filteredLegend
        };
    }

    async getExpenseComparison({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByDate> {
        const unit = getRangeUnit(from, to);
        const groupExpr = this.getRangeGroupByExpression("date", unit);
        const selectExpr = this.getRangeSelectExpression("date", unit);

        let query = this.db
        .selectFrom(EXPENSE_TABLE)
        .select([
            sql<number>`SUM(amount)`.as("total"),
            selectExpr,
            "type_id"
        ])
        .where("date", ">=", from)
        .where("date", "<=", to);

        if(carId) query = query.where("car_id", "=", carId);

        query = query
        .groupBy("type_id")
        .groupBy(groupExpr)
        .orderBy(groupExpr);

        const result = await query.execute();
        const expenseTypes = await this.expenseTypeDao.getAll();
        const typeIds = expenseTypes.map((t) => t.id);

        const barChartData: Array<BarChartItem> = [];

        const groupedData: { [time: string]: { [typeId: string]: number } } = {};

        result.forEach((item) => {
            const time = item.time;
            const typeId = item.type_id;
            const total = item.total;

            if(!groupedData[time]) groupedData[time] = {};

            groupedData[time][typeId] = total;
        });

        for(const time in groupedData) {
            if(Object.prototype.hasOwnProperty.call(groupedData, time)) {
                const dailyData = groupedData[time];
                const valueArray: number[] = [];

                typeIds.forEach((typeId) => {
                    const value = dailyData[typeId] !== undefined ? dailyData[typeId] : 0;
                    valueArray.push(value);
                });

                barChartData.push({
                    label: time,
                    value: valueArray,
                    type: typeIds
                });
            }
        }

        barChartData.sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());

        const barChartTypes: { [key: string]: LegendData } = {};
        expenseTypes.forEach((t) => {
            barChartTypes[t.id] = {
                label: t.key,
                color: t.primaryColor
            };
        });

        return {
            barChartData,
            barChartTypes,
            rangeUnit: unit
        };
    }

    async getServiceExpenseComparison({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByDate> {
        const unit = getRangeUnit(from, to);
        const groupExpr = this.getRangeGroupByExpression("t1.date", unit);
        const selectExpr = this.getRangeSelectExpression("t1.date", unit);

        let query = this.db
        .selectFrom(`${ EXPENSE_TABLE } as t1`)
        .innerJoin(`${ SERVICE_LOG_TABLE } as t2`, "t1.id", "t2.expense_id")
        .select([
            sql<number>`SUM(t1.amount)`.as("total"),
            selectExpr
        ])
        .where("t1.date", ">=", from)
        .where("t1.date", "<=", to);

        if(carId) query = query.where("t1.car_id", "=", carId);

        query = query
        .groupBy(groupExpr)
        .orderBy(groupExpr);

        const result = await query.execute();
        const serviceTypeId = await this.expenseTypeDao.getIdByKey(ExpenseTypeEnum.SERVICE);
        const serviceType = await this.expenseTypeDao.getById(serviceTypeId);

        const barChartData: Array<BarChartItem> = [];

        result.forEach((r) => {
            barChartData.push({
                value: r.total,
                label: r.time,
                type: serviceType?.id ?? "0"
            });
        });

        const barChartTypes: { [key: string]: LegendData } = {
            [serviceType?.id ?? "0"]: {
                label: serviceType?.key ?? ExpenseTypeEnum.SERVICE,
                color: serviceType?.primaryColor ?? COLORS.service
            }
        };

        return {
            barChartData,
            barChartTypes,
            rangeUnit: unit
        };
    }

    async getServiceComparisonByType({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByType> {
        let query = this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as t1`)
        .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
        .select([
            sql<number>`SUM(t2.amount) as total`,
            sql<number>`SUM(t2.amount) * 100.0 / SUM(SUM(t2.amount)) OVER () as percent`,
            "t1.service_type_id as type_id"
        ])
        .where("t2.date", ">=", from)
        .where("t2.date", "<=", to)
        .groupBy("t1.service_type_id")
        .orderBy("total", "desc");

        if(carId) query = query.where("t1.car_id", "=", carId);

        const result = await query.execute();

        const serviceTypes = await this.serviceTypeDao.getAll();
        const legend: { [key: string]: LegendData } = {};
        serviceTypes.forEach((t) => {
            legend[t.id] = {
                label: t.key,
                color: t.primaryColor
            };
        });

        const typesInChart: Set<string> = new Set();

        const donutChartData: Array<DonutChartItem> = result.map((r, index) => {
            typesInChart.add(r.type_id);

            return ({
                value: numberToFractionDigit(r.percent),
                label: legend[r.type_id].label,
                description: numberToFractionDigit(r.total),
                color: legend[r.type_id].color,
                focused: index === 0
            });
        });

        const filteredLegend: { [key: string]: LegendData } = {};

        typesInChart.forEach((typeId) => {
            filteredLegend[typeId] = legend[typeId];
        });

        return {
            donutChartData,
            legend: filteredLegend
        };
    }

    async getServiceItemComparisonByType({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByType> {
        let query = this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as t1`)
        .innerJoin(`${ SERVICE_ITEM_TABLE } as t2`, "t1.id", "t2.service_log_id")
        .innerJoin(`${ EXPENSE_TABLE } as t3`, "t1.expense_id", "t3.id")
        .select([
            sql<number>`SUM(amount) as total`,
            sql<number>`SUM(amount) * 100.0 / SUM(SUM(amount)) OVER () as percent`,
            "t2.service_item_type_id as item_type_id"
        ])
        .where("t3.date", ">=", from)
        .where("t3.date", "<=", to)
        .groupBy("item_type_id")
        .orderBy("total", "desc");

        if(carId) query = query.where("t1.car_id", "=", carId);

        const result = await query.execute();

        const serviceItemTypes = await this.serviceItemTypeDao.getAll();
        const legend: { [key: string]: LegendData } = {};
        serviceItemTypes.forEach((t) => {
            legend[t.id] = {
                label: t.key,
                color: t.primaryColor
            };
        });

        const typesInChart: Set<string> = new Set();

        const donutChartData: Array<DonutChartItem> = result.map((r, index) => {
            typesInChart.add(r.item_type_id);

            return ({
                value: numberToFractionDigit(r.percent),
                label: legend[r.item_type_id].label,
                description: numberToFractionDigit(r.total),
                color: legend[r.item_type_id].color,
                focused: index === 0
            });
        });

        const filteredLegend: { [key: string]: LegendData } = {};

        typesInChart.forEach((typeId) => {
            filteredLegend[typeId] = legend[typeId];
        });

        return {
            donutChartData,
            legend: filteredLegend
        };
    }
}