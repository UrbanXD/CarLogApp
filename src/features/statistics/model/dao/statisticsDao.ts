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
import { FUEL_TANK_TABLE } from "../../../../database/connector/powersync/tables/fuelTank.ts";
import dayjs from "dayjs";
import { getExtendedRange } from "../../utils/getExtendedRange.ts";

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
    average: number
    lineChartData: Array<LineChartItem>
    rangeUnit: RangeUnit
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

export type SummaryStat = {
    max: Stat | null
    min: Stat | null
    total: number
    average: number
    count: number
    previousWindowTotal: number
    previousWindowAverage: number
    previousWindowCount: number
    totalTrend: Trend
    averageTrend: Trend
    countTrend: Trend
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

    async getExpenseSummary({
        carId,
        from,
        to,
        trendOptions,
        expenseType
    }: StatisticsFunctionArgs & { expenseType?: ExpenseTypeEnum }): Promise<SummaryStat> {
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
        const selectedExpenseType =
            maxItemResult
            ?
            await this.expenseTypeDao.mapper.toDto({
                id: maxItemResult.type_id,
                owner_id: maxItemResult.owner_id,
                key: maxItemResult.key
            })
            :
            null;

        const { from: previousWindowFrom, to: previousWindowTo } = getPreviousRangeWindow(from, to);

        let aggregateQuery = this.db
        .selectFrom(EXPENSE_TABLE)
        .select([
            sql<number>`AVG(amount) as average_amount`,
            sql<number>`SUM(amount) as total_amount`,
            sql<number>`COUNT(id) as total_count`
        ])
        .where("date", ">=", from)
        .where("date", "<=", to);

        let previousWindowAggregateQuery = this.db
        .selectFrom(EXPENSE_TABLE)
        .select([
            sql<number>`AVG(amount) as average_amount`,
            sql<number>`SUM(amount) as total_amount`,
            sql<number>`COUNT(id) as total_count`
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

        const aggregateResult = await aggregateQuery.executeTakeFirst();
        const previousWindowAggregateResult = await previousWindowAggregateQuery.executeTakeFirst();

        const total = numberToFractionDigit(aggregateResult.total_amount ?? 0);
        const average = numberToFractionDigit(aggregateResult.average_amount ?? 0);
        const count = numberToFractionDigit(aggregateResult.total_count);
        const previousWindowTotal = numberToFractionDigit(previousWindowAggregateResult.total_amount ?? 0);
        const previousWindowAverage = numberToFractionDigit(previousWindowAggregateResult.average_amount ?? 0);
        const previousWindowCount = numberToFractionDigit(previousWindowAggregateResult.total_count ?? 0);

        return {
            max: maxItemResult
                 ?
                {
                    value: numberToFractionDigit(maxItemResult?.amount ?? 0),
                    label: maxItemResult?.key ?? ExpenseTypeEnum.OTHER,
                    color: selectedExpenseType.primaryColor
                }
                 : null,
            total,
            average,
            count,
            previousWindowTotal,
            previousWindowAverage,
            previousWindowCount,
            totalTrend: calculateTrend(total, previousWindowTotal, trendOptions),
            averageTrend: calculateTrend(average, previousWindowAverage, trendOptions),
            countTrend: calculateTrend(count, previousWindowCount, trendOptions)
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
            sql<number>`SUM(t2.quantity * t2.price_per_unit * t2.exchange_rate) as total`,
            sql<number>`SUM(t2.quantity * t2.price_per_unit * t2.exchange_rate) * 100.0 / SUM(SUM(t2.quantity * t2.price_per_unit * t2.exchange_rate)) OVER () as percent`,
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

    async getTotalDistance({ carId, from, to }: StatisticsFunctionArgs): Promise<SummaryStat> {
        let query = this.db
        .selectFrom(`${ ODOMETER_LOG_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as t2`, "t1.id", "t2.odometer_log_id")
        .innerJoin(`${ CAR_TABLE } as t3`, "t1.car_id", "t3.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t4`, "t3.odometer_unit_id", "t4.id")
        .select([
            sql<number>`MIN(ROUND(t1.value / t4.conversion_factor))`.as("min"),
            sql<number>`MAX(ROUND(t1.value / t4.conversion_factor))`.as("max"),
            sql<number>`MAX(ROUND(t1.value / t4.conversion_factor)) - MIN(ROUND(t1.value / t4.conversion_factor))`
            .as("distance")
        ])
        .where("t2.date", ">=", from)
        .where("t2.date", "<=", to);

        if(carId) query = query.where("t3.id", "=", carId);

        const result = await query.execute();
        console.log(result);
        return null;
    }

    async getFuelSummary({ carId, from, to, trendOptions }: StatisticsFunctionArgs): Promise<{
        quantity: SummaryStat,
        amount: SummaryStat
    }> {
        const fuelExpenseTypeId = await this.expenseTypeDao.getIdByKey(ExpenseTypeEnum.FUEL);

        let maxItemQueryByAmount = this.db
        .selectFrom(`${ EXPENSE_TABLE } as t1`)
        .select("amount")
        .where("date", ">=", from)
        .where("date", "<=", to)
        .where("type_id", "=", fuelExpenseTypeId)
        .orderBy("amount", "desc")
        .limit(1);

        if(carId) maxItemQueryByAmount = maxItemQueryByAmount.where("car_id", "=", carId);

        const maxItemResultByAmount = await maxItemQueryByAmount.executeTakeFirst();

        const { from: previousWindowFrom, to: previousWindowTo } = getPreviousRangeWindow(from, to);

        let aggregateQuery = () => {
            let query = this.db
            .selectFrom(`${ FUEL_LOG_TABLE } as t1`)
            .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
            .innerJoin(`${ CAR_TABLE } as t3`, "t2.car_id", "t3.id")
            .innerJoin(`${ FUEL_TANK_TABLE } as t4`, "t3.id", "t4.car_id")
            .innerJoin(`${ FUEL_UNIT_TABLE } as t5`, "t5.id", "t4.unit_id")
            .select([
                sql<number>`AVG((t1.quantity / t5.conversion_factor)) as average_quantity`,
                sql<number>`SUM((t1.quantity / t5.conversion_factor)) as total_quantity`,
                sql<number>`COUNT(t1.id) as total_count`,
                sql<number>`AVG(t2.amount) as average_amount`,
                sql<number>`SUM(t2.amount) as total_amount`
            ]);

            if(carId) query = query.where("t2.car_id", "=", carId);

            return query;
        };

        let currentWindowAggregateQuery = aggregateQuery()
        .where("t2.date", ">=", from)
        .where("t2.date", "<=", to);

        let previousWindowAggregateQuery = aggregateQuery()
        .where("t2.date", ">=", previousWindowFrom)
        .where("t2.date", "<=", previousWindowTo);

        const aggregateResult = await currentWindowAggregateQuery.executeTakeFirst();
        const previousWindowAggregateResult = await previousWindowAggregateQuery.executeTakeFirst();

        const count = numberToFractionDigit(aggregateResult.total_count ?? 0);
        const previousWindowCount = numberToFractionDigit(previousWindowAggregateResult.total_count ?? 0);

        const totalQuantity = numberToFractionDigit(aggregateResult.total_quantity ?? 0);
        const averageQuantity = numberToFractionDigit(aggregateResult.average_quantity ?? 0);
        const previousWindowTotalQuantity = numberToFractionDigit(previousWindowAggregateResult.total_quantity ?? 0);
        const previousWindowAverageQuantity = numberToFractionDigit(previousWindowAggregateResult.average_quantity ?? 0);

        const totalAmount = numberToFractionDigit(aggregateResult.total_amount ?? 0);
        const averageAmount = numberToFractionDigit(aggregateResult.average_amount ?? 0);
        const previousWindowTotalAmount = numberToFractionDigit(previousWindowAggregateResult.total_amount ?? 0);
        const previousWindowAverageAmount = numberToFractionDigit(previousWindowAggregateResult.average_amount ?? 0);

        return {
            quantity: {
                total: totalQuantity,
                average: averageQuantity,
                count,
                previousWindowTotal: previousWindowTotalQuantity,
                previousWindowAverage: previousWindowAverageQuantity,
                previousWindowCount,
                totalTrend: calculateTrend(totalQuantity, previousWindowTotalQuantity, trendOptions),
                averageTrend: calculateTrend(averageQuantity, previousWindowAverageQuantity, trendOptions),
                countTrend: calculateTrend(count, previousWindowCount, trendOptions)
            },
            amount: {
                max: { value: maxItemResultByAmount.amount },
                total: totalAmount,
                average: averageAmount,
                count,
                previousWindowTotal: previousWindowTotalAmount,
                previousWindowAverage: previousWindowAverageAmount,
                previousWindowCount,
                totalTrend: calculateTrend(totalAmount, previousWindowTotalAmount, trendOptions),
                averageTrend: calculateTrend(averageAmount, previousWindowAverageAmount, trendOptions),
                countTrend: calculateTrend(count, previousWindowCount, trendOptions)
            }
        };
    }

    public async getFuelConsumption(
        { carId, from, to }: StatisticsFunctionArgs
    ): Promise<TrendStat> {
        const { extendedFrom, extendedTo } = getExtendedRange(from, to);

        let query = this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as t1`)
        .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as t3`, "t1.fuel_unit_id", "t3.id")
        .leftJoin(`${ ODOMETER_LOG_TABLE } as t4`, "t1.odometer_log_id", "t4.id")
        .innerJoin(`${ CAR_TABLE } as t6`, "t2.car_id", "t6.id")
        .leftJoin(`${ ODOMETER_UNIT_TABLE } as t7`, "t6.odometer_unit_id", "t7.id")
        .innerJoin(`${ FUEL_TANK_TABLE } as t8`, "t6.id", "t8.car_id")
        //@formatter:off
        .select([
            "t2.date as date",
            sql<number>`t1.quantity / t3.conversion_factor`.as("quantity"),
            sql<number | null>`t4.value / COALESCE(t7.conversion_factor, 1)`.as("odometer_value")
        ])
        //@formatter:on
        .where("t2.date", ">=", extendedFrom)
        .where("t2.date", "<=", extendedTo)
        .orderBy("t2.date", "asc");

        if(carId) {
            query = query.where("t2.car_id", "=", carId) as any;
        }

        const logs = await query.execute();

        const lineChartData: Array<LineChartItem> = [];

        const logsWithOdometerValue = logs.filter(l => l.odometer_value !== null && l.quantity !== null && l.quantity !== undefined);

        if(logsWithOdometerValue.length < 2) return { lineChartData: [], average: 0 };

        let totalQuantity = 0;
        let totalDistance = 0;
        for(let i = 1; i < logsWithOdometerValue.length; i++) {
            const prev = logsWithOdometerValue[i - 1];
            const curr = logsWithOdometerValue[i];

            const distance = curr.odometer_value! - prev.odometer_value!;
            if(distance <= 0) continue;

            totalDistance += distance;

            let quantitySum = 0;
            for(const log of logs) {
                const logDate = dayjs(log.date);
                if(logDate.isBetween(prev.date, curr.date, undefined, i === 1 ? "[]" : "(]")) {
                    quantitySum += log.quantity ?? 0;
                }

                if(logDate.isAfter(dayjs(curr.date))) break;
            }

            if(quantitySum === 0) continue;

            totalQuantity += quantitySum;
            const consumption = (totalQuantity / totalDistance) * 100;

            if(dayjs(curr.date).isBetween(from, to, undefined, i === 1 ? "[]" : "(]")) {
                lineChartData.push({
                    label: curr.date,
                    value: numberToFractionDigit(consumption)
                });
            }
        }

        return {
            lineChartData,
            average: lineChartData?.[lineChartData.length - 1].value ?? 0
        };
    }
}