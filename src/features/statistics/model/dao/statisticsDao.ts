import { Kysely, SelectQueryBuilder, sql } from "kysely";
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
import dayjs, { Dayjs } from "dayjs";
import { getExtendedRange } from "../../utils/getExtendedRange.ts";
import { medianSubQuery } from "../../../../database/dao/utils/medianSubQuery.ts";
import { CURRENCY_TABLE } from "../../../../database/connector/powersync/tables/currency.ts";
import { ServiceTypeEnum } from "../../../expense/_features/service/model/enums/ServiceTypeEnum.ts";
import { formatDateToDatabaseFormat } from "../../utils/formatDateToDatabaseFormat.ts";

type StatisticsFunctionArgs = {
    carId?: string
    from: string
    to: string
    trendOptions?: TrendOptions
}

export type Stat = {
    value: string | number
    unitText?: string
    label?: string
    color?: string
}

export type TrendStat = {
    average: number
    lineChartData: Array<LineChartItem>
    rangeUnit: RangeUnit
    unitText?: string
}

export type ComparisonStatByType = {
    donutChartData: Array<DonutChartItem>
    legend: { [key: string]: LegendData }
    unitText?: string
}

export type ComparisonStatByDate = {
    barChartData: Array<BarChartItem>
    legend?: { [key: string]: LegendData }
    rangeUnit: RangeUnit
    unitText?: string
}

export type SummaryStat = {
    max: Stat | null
    min: Stat | null
    total: number
    average: number
    median: number
    count: number
    previousWindowTotal: number
    previousWindowAverage: number
    previousWindowMedian: number
    previousWindowCount: number
    totalTrend: Trend
    averageTrend: Trend
    medianTrend: Trend
    countTrend: Trend
    unitText?: string
}

export type TopListItemStat = {
    name: string,
    count: number
}

export type Forecast = {
    oldValue: number | string
    value: number | string
    date: string | null
    label?: string
    color?: string
}

export type ServiceForecast = {
    odometer: {
        value: number
        unitText?: string
    }
    major: Forecast | null
    small: Forecast | null
};

export type RideSummaryStat = {
    distance: SummaryStat & { totalDistanceByOdometer: number, mostVisitedPlaces: Array<TopListItemStat> }
    duration: Omit<SummaryStat, "count" | "previousWindowCount" | "unitText">
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

    async getExpenseSummary({
        carId,
        from,
        to,
        trendOptions,
        expenseType
    }: StatisticsFunctionArgs & { expenseType?: ExpenseTypeEnum }): Promise<SummaryStat> {
        let expenseTypeId = null;
        if(expenseType) expenseTypeId = await this.expenseTypeDao.getIdByKey(expenseType);

        const baseQuery = (from: string, to: string) => {
            let query = this.db
            .selectFrom(`${ EXPENSE_TABLE } as t1`)
            .innerJoin(`${ EXPENSE_TYPE_TABLE } as t2`, "t1.type_id", "t2.id")
            .where("t1.date", ">=", formatDateToDatabaseFormat(from))
            .where("t1.date", "<=", formatDateToDatabaseFormat(to));

            if(carId) query = query.where("t1.car_id", "=", carId);
            if(expenseTypeId) query = query.where("t1.type_id", "=", expenseTypeId);

            return query;
        };

        let maxItemQuery = baseQuery(from, to)
        .select([
            "t1.amount",
            "t2.id as type_id",
            "t2.owner_id",
            "t2.key"
        ])
        .orderBy("t1.amount", "desc")
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

        const aggregateQuery = (from: string, to: string) => {
            const query = baseQuery(from, to);

            //@formatter:off
            return query.select(
                [
                    sql<number>`t1.amount`.as("amount"),
                    sql<number>`COUNT(t1.id)`.as("total_count"),
                    sql<number>`AVG(t1.amount)`.as("average_amount"),
                    sql<number>`SUM(t1.amount)`.as("total_amount"),
                    medianSubQuery(this.db, query, "t1.amount").as("median_amount")
                ]
            );
            //@formatter:on
        };

        const aggregateResult = await aggregateQuery(from, to).executeTakeFirst();
        const previousWindowAggregateResult = await aggregateQuery(previousWindowFrom, previousWindowTo)
        .executeTakeFirst();

        const total = numberToFractionDigit(aggregateResult.total_amount ?? 0);
        const average = numberToFractionDigit(aggregateResult.average_amount ?? 0);
        const median = numberToFractionDigit(aggregateResult.median_amount ?? 0);
        const count = numberToFractionDigit(aggregateResult.total_count ?? 0);
        const previousWindowTotal = numberToFractionDigit(previousWindowAggregateResult.total_amount ?? 0);
        const previousWindowAverage = numberToFractionDigit(previousWindowAggregateResult.average_amount ?? 0);
        const previousWindowMedian = numberToFractionDigit(previousWindowAggregateResult.median_amount ?? 0);
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
            median,
            count,
            previousWindowTotal,
            previousWindowAverage,
            previousWindowMedian,
            previousWindowCount,
            totalTrend: calculateTrend(total, previousWindowTotal, trendOptions),
            averageTrend: calculateTrend(average, previousWindowAverage, trendOptions),
            medianTrend: calculateTrend(median, previousWindowMedian, trendOptions),
            countTrend: calculateTrend(count, previousWindowCount, trendOptions),
            unitText: carId && await this.getCarCurrencySymbol(carId)
        };
    }

    async getExpenseComparisonByType({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByType> {
        let query = this.db
        .selectFrom(`${ EXPENSE_TABLE } as t1`)
        //@formatter:off
        .select([
            sql<number>`SUM(t1.amount)`.as("total"),
            sql<number>`SUM(t1.amount) * 100.0 / SUM(SUM(t1.amount)) OVER ()`.as("percent"),
            "t1.type_id as type_id"
        ])
        //@formatter:on
        .where("t1.date", ">=", formatDateToDatabaseFormat(from))
        .where("t1.date", "<=", formatDateToDatabaseFormat(to))
        .groupBy("t1.type_id")
        .orderBy("total", "desc");

        if(carId) query = query.where("t1.car_id", "=", carId);

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
            legend: filteredLegend,
            unitText: carId && await this.getCarCurrencySymbol(carId)
        };
    }

    async getExpenseComparison({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByDate> {
        const rangeUnit = getRangeUnit(from, to);
        const groupExpression = this.getRangeGroupByExpression("t1.date", rangeUnit);
        const selectExpression = this.getRangeSelectExpression("t1.date", rangeUnit);

        let query = this.db
        .selectFrom(`${ EXPENSE_TABLE } as t1`)
        //@formatter:off
        .select([
            sql<number>`SUM(t1.amount)`.as("total"),
            selectExpression,
            "t1.type_id as type_id"
        ])
        //@formatter:on
        .where("t1.date", ">=", formatDateToDatabaseFormat(from))
        .where("t1.date", "<=", formatDateToDatabaseFormat(to));

        if(carId) query = query.where("t1.car_id", "=", carId);

        query = query
        .groupBy("t1.type_id")
        .groupBy(groupExpression)
        .orderBy(groupExpression);

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
                    valueArray.push(numberToFractionDigit(value));
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
            legend: barChartTypes,
            rangeUnit,
            unitText: carId && await this.getCarCurrencySymbol(carId)
        };
    }

    async getServiceExpenseComparison({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByDate> {
        const rangeUnit = getRangeUnit(from, to);
        const groupExpression = this.getRangeGroupByExpression("t1.date", rangeUnit);
        const selectExpression = this.getRangeSelectExpression("t1.date", rangeUnit);

        let query = this.db
        .selectFrom(`${ EXPENSE_TABLE } as t1`)
        .innerJoin(`${ SERVICE_LOG_TABLE } as t2`, "t1.id", "t2.expense_id")
        .select([
            sql<number>`SUM(t1.amount)`.as("total"),
            selectExpression
        ])
        .where("t1.date", ">=", formatDateToDatabaseFormat(from))
        .where("t1.date", "<=", formatDateToDatabaseFormat(to));

        if(carId) query = query.where("t1.car_id", "=", carId);

        query = query
        .groupBy(groupExpression)
        .orderBy(groupExpression);

        const result = await query.execute();
        const serviceTypeId = await this.expenseTypeDao.getIdByKey(ExpenseTypeEnum.SERVICE);
        const serviceType = await this.expenseTypeDao.getById(serviceTypeId);

        const barChartData: Array<BarChartItem> = [];

        result.forEach((r) => {
            barChartData.push({
                label: r.time,
                type: serviceType?.id ?? "0",
                value: numberToFractionDigit(r.total)
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
            legend: barChartTypes,
            rangeUnit,
            unitText: carId && await this.getCarCurrencySymbol(carId)
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
        .where("t2.date", ">=", formatDateToDatabaseFormat(from))
        .where("t2.date", "<=", formatDateToDatabaseFormat(to))
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
            legend: filteredLegend,
            unitText: carId && await this.getCarCurrencySymbol(carId)
        };
    }

    async getServiceItemComparisonByType({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByType> {
        let query = this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as t1`)
        .innerJoin(`${ SERVICE_ITEM_TABLE } as t2`, "t1.id", "t2.service_log_id")
        .innerJoin(`${ EXPENSE_TABLE } as t3`, "t1.expense_id", "t3.id")
        .select([
            sql<number>`SUM(t2.quantity * t2.price_per_unit * t2.exchange_rate)`.as("total"),
            sql<number>`SUM(t2.quantity * t2.price_per_unit * t2.exchange_rate) * 100.0 / SUM(SUM(t2.quantity * t2.price_per_unit * t2.exchange_rate)) OVER ()`.as(
                "percent"),
            "t2.service_item_type_id as item_type_id"
        ])
        .where("t3.date", ">=", formatDateToDatabaseFormat(from))
        .where("t3.date", "<=", formatDateToDatabaseFormat(to))
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
            legend: filteredLegend,
            unitText: carId && await this.getCarCurrencySymbol(carId)
        };
    }

    async getStatBetweenServices({
        carId,
        from,
        to
    }: StatisticsFunctionArgs): Promise<{
        averageDistance: Omit<Stat, "label" | "color">,
        averageTime: Omit<Stat, "label" | "color">
    }> {
        let query = this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t2`, "t1.odometer_log_id", "t2.id")
        .innerJoin(`${ CAR_TABLE } as t3`, "t1.car_id", "t3.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t4`, "t3.odometer_unit_id", "t4.id")
        .innerJoin(`${ EXPENSE_TABLE } as t5`, "t1.expense_id", "t5.id")
        .select([
            sql`ROUND
            ((MAX (ROUND(t2.value / t4.conversion_factor)) - MIN (ROUND(t2.value / t4.conversion_factor)))
                / (COUNT(t1.id) - 1))`.as("average_distance"),
            sql`(JULIANDAY( MAX (t5.date)) - JULIANDAY(MIN (t5.date)))
                / (COUNT(t1.id) - 1)`.as("average_time")
        ])
        .where("t5.date", ">=", formatDateToDatabaseFormat(from))
        .where("t5.date", "<=", formatDateToDatabaseFormat(to));

        if(carId) query = query.where("t1.car_id", "=", carId);

        const result = await query.executeTakeFirst();

        return {
            averageDistance: {
                value: numberToFractionDigit(result?.average_distance ?? 0),
                unitText: carId ? await this.getCarOdometerUnit(carId) : null
            },
            averageTime: {
                value: result?.average_time ?? 0
            }
        };
    }

    async getServiceFrequencyByOdometer({ carId, from, to, intervalSize = 50000 }: StatisticsFunctionArgs & {
        intervalSize?: number
    }): Promise<ComparisonStatByDate> {
        let query = this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t2`, "t1.odometer_log_id", "t2.id")
        .innerJoin(`${ CAR_TABLE } as t3`, "t1.car_id", "t3.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t4`, "t3.odometer_unit_id", "t4.id")
        .innerJoin(`${ EXPENSE_TABLE } as t5`, "t1.expense_id", "t5.id")
        //@formatter:off
        .select([
            sql`COUNT(t1.id)`.as("service_count"),
            sql`CAST(ROUND(t2.value / t4.conversion_factor) / ${intervalSize} AS INT) * ${intervalSize}`.as("interval_start")
        ])
        //@formatter:on
        .where("t5.date", ">=", formatDateToDatabaseFormat(from))
        .where("t5.date", "<=", formatDateToDatabaseFormat(to))
        .groupBy("interval_start")
        .orderBy("interval_start", "asc");

        if(carId) query = query.where("t1.car_id", "=", carId);

        const result = await query.execute();

        return {
            barChartData: result.map((r) => ({
                value: r.service_count ?? 0,
                label: r?.interval_start?.toString() ?? "0"
            })),
            unitText: carId ? await this.getCarOdometerUnit(carId) : null
        };
    };

    async getForecastForService(carId: string): ServiceForecast {
        const MAJOR_SERVICE_INTERVAL_ODOMETER = 60000; //KM
        const MAJOR_SERVICE_INTERVAL_TIME = 2 * 365; // Day
        const SMALL_SERVICE_INTERVAL_ODOMETER = 15000; //KM
        const SMALL_SERVICE_INTERVAL_TIME = 365; // Day

        const majorServiceId = await this.serviceTypeDao.getIdByKey(ServiceTypeEnum.MAJOR_SERVICE);
        const smallServiceId = await this.serviceTypeDao.getIdByKey(ServiceTypeEnum.SMALL_SERVICE);

        const oldServices = await this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t2`, "t1.odometer_log_id", "t2.id")
        .innerJoin(`${ CAR_TABLE } as t3`, "t1.car_id", "t3.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t4`, "t3.odometer_unit_id", "t4.id")
        .innerJoin(`${ EXPENSE_TABLE } as t5`, "t1.expense_id", "t5.id")
        //@formatter:off
        .select([
            "t1.service_type_id as type_id",
            sql`MAX(ROUND(t2.value / t4.conversion_factor))`.as("odometer_value"),
            sql`ROUND((MAX(ROUND(t2.value / t4.conversion_factor)) + ROUND(((CASE WHEN t1.service_type_id = ${ sql.val(majorServiceId) } THEN ${ sql.val(MAJOR_SERVICE_INTERVAL_ODOMETER) } ELSE ${ sql.val(SMALL_SERVICE_INTERVAL_ODOMETER) } END) / t4.conversion_factor))) / 1000) * 1000`.as("forecast_odometer"),
            //ROUND(X / n) * n, n = 1000 for round up to first 1000 52899 -> 53000
            "t5.date as date",
            sql`DATE(
                t5.date, 
                '+' ||
                (
                    CASE WHEN t1.service_type_id = ${ sql.val(majorServiceId) }
                    THEN ${ sql.val(MAJOR_SERVICE_INTERVAL_TIME) }
                    ELSE ${ sql.val(SMALL_SERVICE_INTERVAL_TIME) } END
                )
                || ' days'
            )`.as("max_forecast_date")
        ])
        //@formatter:on
        .where("t1.car_id", "=", carId)
        .where("t1.service_type_id", "in", [smallServiceId, majorServiceId])
        .groupBy("t1.service_type_id")
        .execute();

        const averageDistanceDailyInLastMonths = await this.getAverageDistanceDaily({
            carId: carId,
            from: dayjs().subtract(3, "month").toISOString(),
            to: dayjs().toISOString()
        });

        const currentOdometer = await this.db
        .selectFrom(`${ ODOMETER_LOG_TABLE } as t1`)
        .innerJoin(`${ CAR_TABLE } as t2`, "t1.car_id", "t2.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t3`, "t2.odometer_unit_id", "t3.id")
        //@formatter:off
        .select([
            sql`MAX(ROUND(t1.value / t3.conversion_factor))`.as("value"),
            sql`t3.short`
        ])
        //@formatter:on
        .where("t1.car_id", "=", carId)
        .executeTakeFirst();

        const odometer = Number(currentOdometer?.value ?? 0);
        const serviceForecast: ServiceForecast = {
            odometer: {
                value: odometer,
                unitText: currentOdometer?.short
            }
        };

        const now = dayjs();
        oldServices.forEach((service) => {
            const serviceOdometer = Number(service?.odometer_value ?? 0);
            const serviceForecastOdometer = Number(service?.forecast_odometer ?? 0);

            let nextServiceDate: Dayjs = service.max_forecast_date
                                         ? dayjs(service.max_forecast_date)
                                         : now.add(1, "year");

            if(averageDistanceDailyInLastMonths <= 0) {
                nextServiceDate = null;
            } else if(serviceForecastOdometer <= odometer) {
                nextServiceDate = now;
            } else {
                const daysToNextServiceByDailyDistance = (serviceForecastOdometer - serviceOdometer) / averageDistanceDailyInLastMonths;
                const nextServiceDateByDailyDistance = now.add(daysToNextServiceByDailyDistance, "day");
                nextServiceDate = nextServiceDateByDailyDistance.isAfter(nextServiceDate)
                                  ? nextServiceDate
                                  : nextServiceDateByDailyDistance;
            }

            let forecast: Forecast = {
                oldValue: serviceOdometer,
                value: serviceForecastOdometer,
                date: nextServiceDate ? nextServiceDate.toISOString() : null
            };

            if(service.type_id === majorServiceId) {
                serviceForecast.major = forecast;
            } else if(service.type_id === smallServiceId) {
                serviceForecast.small = forecast;
            }
        });

        return serviceForecast;
    }

    async getFuelSummary({ carId, from, to, trendOptions }: StatisticsFunctionArgs): Promise<{
        quantity: SummaryStat,
        amount: SummaryStat
    }> {
        const baseQuery = (from: string, to: string) => {
            let query = this.db
            .selectFrom(`${ FUEL_LOG_TABLE } as t1`)
            .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
            .innerJoin(`${ CAR_TABLE } as t3`, "t2.car_id", "t3.id")
            .innerJoin(`${ FUEL_TANK_TABLE } as t4`, "t3.id", "t4.car_id")
            .innerJoin(`${ FUEL_UNIT_TABLE } as t5`, "t4.unit_id", "t5.id")
            .where("t2.date", ">=", formatDateToDatabaseFormat(from))
            .where("t2.date", "<=", formatDateToDatabaseFormat(to));

            if(carId) query = query.where("t3.id", "=", carId);

            return query;
        };

        const quantityExpression = sql<number>`(t1.quantity / t5.conversion_factor)`;

        const maxItemResultByAmount = await baseQuery(from, to)
        .select("t2.amount")
        .orderBy("t2.amount", "desc")
        .limit(1)
        .executeTakeFirst();

        const maxItemResultByQuantity = await baseQuery(from, to)
        .select(quantityExpression.as("quantity"))
        .orderBy("quantity", "desc")
        .limit(1)
        .executeTakeFirst();

        const { from: previousWindowFrom, to: previousWindowTo } = getPreviousRangeWindow(from, to);

        const aggregateQuery = (from: string, to: string) => {
            const base = baseQuery(from, to);

            //@formatter:off
            return base
            .select([
                "t5.short as quantity_unit",
                sql<number>`AVG(${ quantityExpression })`.as("average_quantity"),
                sql<number>`SUM(${ quantityExpression })`.as("total_quantity"),
                sql<number>`COUNT(t1.id)`.as("total_count"),
                sql<number>`AVG(t2.amount)`.as("average_amount"),
                sql<number>`SUM(t2.amount)`.as("total_amount"),
                medianSubQuery(this.db, base, "t2.amount").as("median_amount"),
                medianSubQuery(this.db, base, quantityExpression).as("median_quantity")
            ]);
            //@formatter:on
        };

        const aggregateResult = await aggregateQuery(from, to).executeTakeFirst();
        const previousWindowAggregateResult = await aggregateQuery(previousWindowFrom, previousWindowTo)
        .executeTakeFirst();

        const count = numberToFractionDigit(aggregateResult.total_count ?? 0);
        const previousWindowCount = numberToFractionDigit(previousWindowAggregateResult.total_count ?? 0);

        const totalQuantity = numberToFractionDigit(aggregateResult.total_quantity ?? 0);
        const averageQuantity = numberToFractionDigit(aggregateResult.average_quantity ?? 0);
        const medianQuantity = numberToFractionDigit(aggregateResult.median_quantity ?? 0);
        const previousWindowTotalQuantity = numberToFractionDigit(previousWindowAggregateResult.total_quantity ?? 0);
        const previousWindowAverageQuantity = numberToFractionDigit(previousWindowAggregateResult.average_quantity ?? 0);
        const previousWindowMedianQuantity = numberToFractionDigit(previousWindowAverageQuantity.median_quantity ?? 0);

        const totalAmount = numberToFractionDigit(aggregateResult.total_amount ?? 0);
        const averageAmount = numberToFractionDigit(aggregateResult.average_amount ?? 0);
        const medianAmount = numberToFractionDigit(aggregateResult.median_amount ?? 0);
        const previousWindowTotalAmount = numberToFractionDigit(previousWindowAggregateResult.total_amount ?? 0);
        const previousWindowAverageAmount = numberToFractionDigit(previousWindowAggregateResult.average_amount ?? 0);
        const previousWindowMedianAmount = numberToFractionDigit(previousWindowAggregateResult.median_amount ?? 0);

        return {
            quantity: {
                max: { value: numberToFractionDigit(maxItemResultByQuantity?.quantity ?? 0) },
                total: totalQuantity,
                average: averageQuantity,
                median: medianQuantity,
                count,
                previousWindowTotal: previousWindowTotalQuantity,
                previousWindowAverage: previousWindowAverageQuantity,
                previousWindowMedian: previousWindowMedianQuantity,
                previousWindowCount,
                totalTrend: calculateTrend(totalQuantity, previousWindowTotalQuantity, trendOptions),
                averageTrend: calculateTrend(averageQuantity, previousWindowAverageQuantity, trendOptions),
                medianTrend: calculateTrend(medianQuantity, previousWindowMedianQuantity, trendOptions),
                countTrend: calculateTrend(count, previousWindowCount, trendOptions),
                unitText: aggregateResult?.quantity_unit
            },
            amount: {
                max: { value: numberToFractionDigit(maxItemResultByAmount?.amount ?? 0) },
                total: totalAmount,
                average: averageAmount,
                median: medianAmount,
                count,
                previousWindowTotal: previousWindowTotalAmount,
                previousWindowAverage: previousWindowAverageAmount,
                previousWindowMedian: previousWindowMedianAmount,
                previousWindowCount,
                totalTrend: calculateTrend(totalAmount, previousWindowTotalAmount, trendOptions),
                averageTrend: calculateTrend(averageAmount, previousWindowAverageAmount, trendOptions),
                medianTrend: calculateTrend(medianAmount, previousWindowMedianAmount, trendOptions),
                countTrend: calculateTrend(count, previousWindowCount, trendOptions),
                unitText: carId && await this.getCarCurrencySymbol(carId)
            }
        };
    }

    public async getFuelConsumption(
        { carId, from, to }: StatisticsFunctionArgs
    ): Promise<TrendStat> {
        const { extendedFrom, extendedTo } = getExtendedRange(from, to);

        let unitQuery = this.db
        .selectFrom(`${ CAR_TABLE } as t1`)
        .select([
            "t4.short as fuel_unit",
            "t2.short as odometer_unit"
        ])
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t2`, "t1.odometer_unit_id", "t2.id")
        .innerJoin(`${ FUEL_TANK_TABLE } as t3`, "t1.id", "t3.car_id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as t4`, "t3.unit_id", "t4.id")
        .where("t1.id", "=", carId);

        const unit = await unitQuery.executeTakeFirst();
        const unitText = `${ unit.fuel_unit } / 100 ${ unit.odometer_unit }`;

        let query = this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as t1`)
        .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
        .leftJoin(`${ ODOMETER_LOG_TABLE } as t3`, "t1.odometer_log_id", "t3.id")
        .innerJoin(`${ CAR_TABLE } as t4`, "t2.car_id", "t4.id")
        .innerJoin(`${ FUEL_TANK_TABLE } as t5`, "t4.id", "t5.car_id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as t6`, "t5.unit_id", "t6.id")
        .leftJoin(`${ ODOMETER_UNIT_TABLE } as t7`, "t4.odometer_unit_id", "t7.id")
        //@formatter:off
        .select([
            "t2.date as date",
            sql<number>`t1.quantity / t6.conversion_factor`.as("quantity"),
            sql<number | null>`t3.value / COALESCE(t7.conversion_factor, 1)`.as("odometer_value")
        ])
        //@formatter:on
        .where("t2.date", ">=", formatDateToDatabaseFormat(extendedFrom))
        .where("t2.date", "<=", formatDateToDatabaseFormat(extendedTo))
        .orderBy("t2.date", "asc");

        if(carId) {
            query = query.where("t2.car_id", "=", carId);
        }

        const logs = await query.execute();

        const lineChartData: Array<LineChartItem> = [];

        const logsWithOdometerValue = logs.filter(l => l.odometer_value !== null && l.quantity !== null && l.quantity !== undefined);

        if(logsWithOdometerValue.length < 2) {
            return {
                lineChartData: [],
                average: 0,
                unitText
            };
        }

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
            const consumption = numberToFractionDigit((totalQuantity / totalDistance) * 100);

            if(dayjs(curr.date).isBetween(from, to, undefined, i === 1 ? "[]" : "(]")) {
                lineChartData.push({
                    label: curr.date,
                    value: consumption
                });
            }
        }

        return {
            lineChartData,
            average: lineChartData?.[lineChartData.length - 1].value ?? 0,
            unitText
        };
    }

    public async getFuelCostPerDistance(
        { carId, from, to }: StatisticsFunctionArgs
    ): Promise<TrendStat> {
        const rangeUnit = getRangeUnit(from, to);

        const currency = await this.getCarCurrencySymbol(carId);
        const odometerUnit = await this.getCarOdometerUnit(carId);

        const unitText = `${ currency } / 100 ${ odometerUnit }`;

        const odometerQuery = this.odometerQuery(carId, from, to)
        //@formatter:off
        .select([
            sql`ROUND(t1.value / t3.conversion_factor)`.as("odometer_value"),
            sql<string>`COALESCE(t8.date, t7.date, t4.date)`.as("date")
        ])
        //@formatter:on

        const allOdometerLogs = await odometerQuery.execute();

        const fuelExpenseBaseQuery = (from: string, to: string) => {
            let query = this.db
            .selectFrom(`${ FUEL_LOG_TABLE } as t1`)
            .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
            //@formatter:off
            .select(sql`SUM(t2.amount)`.as("cost"))
            //@formatter:on
            .where("t2.date", ">=", formatDateToDatabaseFormat(from))
            .where("t2.date", "<=", formatDateToDatabaseFormat(to))

            if(carId) query = query.where("t2.car_id", "=", carId);

            return query;
        };

        let totalCost = 0;
        let totalDistance = 0;
        let prevOdometer = allOdometerLogs[0];

        const lineChartData: Array<LineChartItem> = [];
        for(let i = 1; i < allOdometerLogs.length; i++) {
            const currOdometer = allOdometerLogs[i];

            const distance = currOdometer.odometer_value! - prevOdometer.odometer_value!;
            if(distance <= 0) continue;
            totalDistance += distance;

            const costSum = (await fuelExpenseBaseQuery(
                prevOdometer.date,
                dayjs(currOdometer.date).subtract((i === allOdometerLogs.length - 1) ? 0 : 1, "second")
            )
            .executeTakeFirst())?.cost ?? 0;

            prevOdometer = currOdometer;

            if(costSum <= 0) continue;
            totalCost += costSum;
            totalDistance += distance;

            const costPerDistance = numberToFractionDigit((totalCost / totalDistance) * 100);

            if(costPerDistance > 0 && dayjs(currOdometer.date).isBetween(from, to, undefined, "[]")) {
                lineChartData.push({
                    label: currOdometer.date,
                    value: costPerDistance
                });
            }
        }

        return {
            lineChartData,
            average: Number(lineChartData[lineChartData.length - 1]?.value ?? 0) ?? 0,
            rangeUnit,
            unitText
        };
    }

    async getFuelExpenseComparisonByDateWindow({
        carId,
        from,
        to
    }: StatisticsFunctionArgs): Promise<ComparisonStatByDate> {
        const rangeUnit = getRangeUnit(from, to);
        const groupExpression = this.getRangeGroupByExpression("t1.date", rangeUnit);
        const selectExpression = this.getRangeSelectExpression("t1.date", rangeUnit);

        let query = this.db
        .selectFrom(`${ EXPENSE_TABLE } as t1`)
        .innerJoin(`${ FUEL_LOG_TABLE } as t2`, "t1.id", "t2.expense_id")
        .select([
            sql<number>`SUM(t1.amount)`.as("total"),
            selectExpression
        ])
        .where("t1.date", ">=", formatDateToDatabaseFormat(from))
        .where("t1.date", "<=", formatDateToDatabaseFormat(to));

        if(carId) query = query.where("t1.car_id", "=", carId);

        query = query
        .groupBy(groupExpression)
        .orderBy(groupExpression);

        const result = await query.execute();
        const fuelTypeId = await this.expenseTypeDao.getIdByKey(ExpenseTypeEnum.FUEL);
        const fuelType = await this.expenseTypeDao.getById(fuelTypeId);

        const barChartData: Array<BarChartItem> = [];

        result.forEach((r) => {
            barChartData.push({
                label: r.time,
                type: fuelType?.id ?? "0",
                value: numberToFractionDigit(r.total)
            });
        });

        const barChartTypes: { [key: string]: LegendData } = {
            [fuelType?.id ?? "0"]: {
                label: fuelType?.key ?? ExpenseTypeEnum.FUEL,
                color: fuelType?.primaryColor ?? COLORS.fuelYellow
            }
        };

        return {
            barChartData,
            legend: barChartTypes,
            rangeUnit,
            unitText: carId && await this.getCarCurrencySymbol(carId)
        };
    }

    async getRideSummary({
        carId,
        from,
        to,
        trendOptions
    }: StatisticsFunctionArgs): Promise<RideSummaryStat> {
        const totalDistance = await this.getTotalDistance(carId, from, to);
        const mostVisitedPlaces = await this.getMostVisitedPlaces(carId, from, to);

        const baseQuery = (from: string, to: string, odometer?: boolean = true) => {
            let query = this.db
            .selectFrom(`${ RIDE_LOG_TABLE } as t1`)
            .where("t1.start_time", ">=", formatDateToDatabaseFormat(from))
            .where("t1.end_time", "<=", formatDateToDatabaseFormat(to));

            if(odometer) {
                query = query
                .innerJoin(`${ ODOMETER_LOG_TABLE } as t2`, "t1.start_odometer_log_id", "t2.id")
                .innerJoin(`${ ODOMETER_LOG_TABLE } as t3`, "t1.end_odometer_log_id", "t3.id")
                .innerJoin(`${ CAR_TABLE } as t4`, "t1.car_id", "t4.id")
                .innerJoin(`${ ODOMETER_UNIT_TABLE } as t5`, "t4.odometer_unit_id", "t5.id");
            }

            if(carId) query = query.where("t1.car_id", "=", carId);

            return query;
        };

        //@formatter:off
        const distanceExpression = sql<number>`ROUND(t3.value / t5.conversion_factor) - ROUND(t2.value / t5.conversion_factor)`;
        const durationExpression = sql<number>`(julianday(t1.end_time) - julianday(t1.start_time))`;
        //@formatter:on

        const { from: previousWindowFrom, to: previousWindowTo } = getPreviousRangeWindow(from, to);

        const aggregateDurationQuery = (from: string, to: string) => {
            const base = baseQuery(from, to, false);

            return base
            //@formatter:off
            .select([
                sql<number>`MAX(${ durationExpression })`.as("max_ride_duration"),
                sql<number>`AVG(${ durationExpression })`.as("average_ride_duration"),
                sql<number>`SUM(${ durationExpression })`.as("total_ride_duration"),
                medianSubQuery(this.db, base, durationExpression).as("median_ride_duration")
            ])
            //@formatter:on
        }

        const aggregateDistanceQuery = (from: string, to: string) => {
            const base = baseQuery(from, to);

            return base
            //@formatter:off
            .select([
                "t5.short as unit",
                sql<number>`MAX(${ distanceExpression })`.as("max_ride_distance"),
                sql<number>`AVG(${ distanceExpression })`.as("average_ride_distance"),
                sql<number>`SUM(${ distanceExpression })`.as("total_ride_distance"),
                sql<number>`COUNT(t1.id)`.as("total_count"),
                medianSubQuery(this.db, base, distanceExpression).as("median_ride_distance")
            ]);
            //@formatter:on
        };

        const aggregateDurationResult = await aggregateDurationQuery(from, to)
        .executeTakeFirst();
        const previousWindowDurationAggregateResult = await aggregateDurationQuery(previousWindowFrom, previousWindowTo)
        .executeTakeFirst();

        const aggregateDistanceResult = await aggregateDistanceQuery(from, to)
        .executeTakeFirst();
        const previousWindowDistanceAggregateResult = await aggregateDistanceQuery(previousWindowFrom, previousWindowTo)
        .executeTakeFirst();

        const count = numberToFractionDigit(aggregateDistanceResult.total_count ?? 0);
        const previousWindowCount = numberToFractionDigit(previousWindowDistanceAggregateResult.total_count ?? 0);

        const totalRideDistance = numberToFractionDigit(aggregateDistanceResult.total_ride_distance ?? 0);
        const averageRideDistance = numberToFractionDigit(aggregateDistanceResult.average_ride_distance ?? 0);
        const medianRideDistance = numberToFractionDigit(aggregateDistanceResult.median_ride_distance ?? 0);
        const previousWindowTotalRideDistance = numberToFractionDigit(previousWindowDistanceAggregateResult.total_ride_distance ?? 0);
        const previousWindowAverageRideDistance = numberToFractionDigit(previousWindowDistanceAggregateResult.average_ride_distance ?? 0);
        const previousWindowMedianRideDistance = numberToFractionDigit(previousWindowDistanceAggregateResult.median_ride_distance ?? 0);

        const totalRideDuration = aggregateDurationResult.total_ride_duration ?? 0;
        const averageRideDuration = aggregateDurationResult.average_ride_duration ?? 0;
        const medianRideDuration = aggregateDurationResult.median_ride_duration ?? 0;
        const previousWindowTotalRideDuration = previousWindowDurationAggregateResult.total_ride_duration ?? 0;
        const previousWindowAverageRideDuration = previousWindowDurationAggregateResult.average_ride_duration ?? 0;
        const previousWindowMedianRideDuration = previousWindowDurationAggregateResult.median_ride_duration ?? 0;

        return {
            distance: {
                max: { value: numberToFractionDigit(aggregateDistanceResult?.max_ride_distance ?? 0) },
                total: totalRideDistance,
                average: averageRideDistance,
                median: medianRideDistance,
                count,
                previousWindowTotal: previousWindowTotalRideDistance,
                previousWindowAverage: previousWindowAverageRideDistance,
                previousWindowMedian: previousWindowMedianRideDistance,
                previousWindowCount,
                totalTrend: calculateTrend(totalRideDistance, previousWindowTotalRideDistance, trendOptions),
                averageTrend: calculateTrend(averageRideDistance, previousWindowAverageRideDistance, trendOptions),
                medianTrend: calculateTrend(medianRideDistance, previousWindowMedianRideDistance, trendOptions),
                countTrend: calculateTrend(count, previousWindowCount, trendOptions),
                unitText: aggregateDistanceResult?.unit,
                totalDistanceByOdometer: totalDistance,
                mostVisitedPlaces
            },
            duration: {
                max: { value: aggregateDurationResult?.max_ride_duration ?? 0 },
                total: totalRideDuration,
                average: averageRideDuration,
                median: medianRideDuration,
                previousWindowTotal: previousWindowTotalRideDuration,
                previousWindowAverage: previousWindowAverageRideDuration,
                previousWindowMedian: previousWindowMedianRideDuration,
                totalTrend: calculateTrend(totalRideDuration, previousWindowTotalRideDuration, trendOptions),
                averageTrend: calculateTrend(averageRideDuration, previousWindowAverageRideDuration, trendOptions),
                medianTrend: calculateTrend(medianRideDuration, previousWindowMedianRideDuration, trendOptions)
            }
        };
    }

    async getDrivingActivity({ carId, from, to }: StatisticsFunctionArgs): Promise<TrendStat> {
        const rangeUnit = getRangeUnit(from, to);
        const groupExpression = this.getRangeGroupByExpression("t1.start_time", rangeUnit);
        const selectExpression = this.getRangeSelectExpression("t1.start_time", rangeUnit);

        let query = this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t2`, "t1.start_odometer_log_id", "t2.id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t3`, "t1.end_odometer_log_id", "t3.id")
        .innerJoin(`${ CAR_TABLE } as t4`, "t1.car_id", "t4.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t5`, "t4.odometer_unit_id", "t5.id")
        .select([
            sql<number>`SUM(ROUND((t3.value - t2.value) / t5.conversion_factor))`.as("activity"),
            selectExpression
        ])
        .where("t1.start_time", ">=", formatDateToDatabaseFormat(from))
        .where("t1.start_time", "<=", formatDateToDatabaseFormat(to));

        if(carId) query = query.where("t1.car_id", "=", carId);

        query = query
        .groupBy(groupExpression)
        .orderBy(groupExpression);

        const result = await query.execute();

        return {
            lineChartData: result.map(r => ({
                label: r.time,
                value: r.activity
            })),
            rangeUnit,
            unitText: carId && await this.getCarOdometerUnit(carId)
        };
    }

    async getRideFrequency({ carId, from, to }: StatisticsFunctionArgs): Promise<ComparisonStatByDate> {
        const rangeUnit = getRangeUnit(from, to);
        const groupExpression = this.getRangeGroupByExpression("t1.start_time", rangeUnit);
        const selectExpression = this.getRangeSelectExpression("t1.start_time", rangeUnit);

        let query = this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as t1`)
        .select([
            sql<number>`COUNT(t1.id)`.as("count"),
            selectExpression
        ])
        .where("t1.start_time", ">=", formatDateToDatabaseFormat(from))
        .where("t1.start_time", "<=", formatDateToDatabaseFormat(to));

        if(carId) query = query.where("t1.car_id", "=", carId);

        query = query
        .groupBy(groupExpression)
        .orderBy(groupExpression);

        const result = await query.execute();

        return {
            barChartData: result.map((r) => ({
                label: r.time,
                value: r.count
            })),
            rangeUnit
        };
    }

    /* UTILS */

    protected odometerQuery(carId: string, from: string, to: string): SelectQueryBuilder<any, any, any> {
        return this.db
        .selectFrom(`${ ODOMETER_LOG_TABLE } as t1`)
        .innerJoin(`${ CAR_TABLE } as t2`, "t1.car_id", "t2.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t3`, "t2.odometer_unit_id", "t3.id")
        .leftJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as t4`, "t1.id", "t4.odometer_log_id")
        .leftJoin(`${ FUEL_LOG_TABLE } as t5`, "t1.id", "t5.odometer_log_id")
        .leftJoin(`${ SERVICE_LOG_TABLE } as t6`, "t1.id", "t6.odometer_log_id")
        .leftJoin(`${ EXPENSE_TABLE } as t7`, "t5.expense_id", "t7.id")
        .leftJoin(`${ EXPENSE_TABLE } as t8`, "t6.expense_id", "t8.id")
        .where("t1.car_id", "=", carId)
        .where(sql`COALESCE(t8.date, t7.date, t4.date) IS NOT NULL`)
        .where(sql`COALESCE(t8.date, t7.date, t4.date)`, ">=", formatDateToDatabaseFormat(from))
        .where(sql`COALESCE(t8.date, t7.date, t4.date)`, "<=", formatDateToDatabaseFormat(to))
        .orderBy(sql`COALESCE(t8.date, t7.date, t4.date)`, "asc")
        .orderBy("t1.value", "asc")
        .orderBy("t1.id", "asc");
    }

    protected async getTotalDistance(carId: string, from: string, to: string): Promise<number> {
        const query = this.odometerQuery(carId, from, to)
        .select([
            sql<number>`MIN(ROUND(t1.value / t3.conversion_factor))`.as("min"),
            sql<number>`MAX(ROUND(t1.value / t3.conversion_factor))`.as("max"),
            sql<number>`MAX(ROUND(t1.value / t3.conversion_factor)) - MIN(ROUND(t1.value / t3.conversion_factor))`
            .as("distance")
        ]);

        return (await query.executeTakeFirst())?.distance ?? 0;
    }

    protected async getMostVisitedPlaces(carId: string, from: string, to: string): Promise<Array<TopListItemStat>> {
        const query = this.db
        .selectFrom(`${ RIDE_PLACE_TABLE } as t1`)
        .innerJoin(`${ RIDE_LOG_TABLE } as t2`, "t1.ride_log_id", "t2.id")
        .innerJoin(`${ PLACE_TABLE } as t3`, "t1.place_id", "t3.id")
        .select([
            "t3.name",
            sql`COUNT(t1.id)`.as("count")
        ])
        .where("t2.car_id", "=", carId)
        .where("t2.start_time", ">=", formatDateToDatabaseFormat(from))
        .where("t2.start_time", "<=", formatDateToDatabaseFormat(to))
        .groupBy("t3.id")
        .orderBy("count", "desc")
        .limit(3);

        return query.execute();
    }

    protected async getCarCurrencySymbol(carId: string): string | null {
        const query = this.db
        .selectFrom(`${ CAR_TABLE } as t1`)
        .innerJoin(`${ CURRENCY_TABLE } as t2`, "t1.currency_id", "t2.id")
        .select("t2.symbol as currency_symbol")
        .where("t1.id", "=", carId);

        return (await query.executeTakeFirst())?.currency_symbol;
    }

    protected async getCarOdometerUnit(carId: string): string | null {
        const query = this.db
        .selectFrom(`${ CAR_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t2`, "t1.odometer_unit_id", "t2.id")
        .select("t2.short as odometer_unit")
        .where("t1.id", "=", carId);

        return (await query.executeTakeFirst())?.odometer_unit;
    }

    protected async getAverageDistanceDaily({ carId, from, to }: StatisticsFunctionArgs): Promise<number> {
        if(dayjs(to).diff(from, "day") <= 0) return 0;

        const query = this.odometerQuery(carId, from, to)
        //@formatter:off
        .select([
            sql<number>`(MAX (ROUND(t1.value / t3.conversion_factor)) - MIN (ROUND(t1.value / t3.conversion_factor))) / (JULIANDAY(${ sql.val(to) }) - JULIANDAY(${ sql.val(from) }))`.as("daily_average")
        ])
        //@formatter:on

        const result = await query.executeTakeFirst();
        return result?.daily_average ?? 0;
    }

    protected getRangeGroupByExpression(fieldName: string, unit: RangeUnit) {
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

    protected getRangeSelectExpression(fieldName: string, unit: RangeUnit) {
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
}