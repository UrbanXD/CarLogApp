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

export type TrendStat = {
    current: number
    previous: number
}

export type TopListItemStat = {
    name: string,
    count: number
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

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getFuelCostTrend(carId?: string, type?: "year" | "month"): Promise<TrendStat> {
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

    async getServiceCostTrend(carId: string, type?: "year" | "month"): Promise<TrendStat> {
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

    async getTotalCostTrend(carId?: string, type?: "year" | "month"): Promise<TrendStat> {
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

    async getDistanceTrend(carId?: string, type?: "year" | "month"): Promise<TrendStat> {
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

    async getFuelConsumption(carId?: string, type?: "year" | "month"): Promise<TrendStat> {
        const distance = await this.getDistanceTrend(carId, type);

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

    async getCostPerDistance(carId?: string, type?: "year" | "month"): Promise<TrendStat> {
        const totalCost = await this.getTotalCostTrend(carId, type);
        const distance = await this.getDistanceTrend(carId, type);

        return {
            current: distance.current === 0
                     ? 0
                     : numberToFractionDigit((totalCost.current / distance.current) * 100),
            previous: distance.previous === 0
                      ? 0
                      : numberToFractionDigit((totalCost.previous / distance.previous) * 100)
        } as TrendStat;
    }

    async getLongestRideDistance(carId?: string, type?: "year" | "month"): Promise<TrendStat> {
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

        return result as TrendStat;
    }

    async getAverageRideDistance(carId?: string, type?: "year" | "month"): Promise<TrendStat> {
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

        return result as TrendStat;
    }

    async getLongestRideDuration(carId?: string, type?: "year" | "month"): Promise<TrendStat> {
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

        return await query.executeTakeFirst() as TrendStat;
    }

    async getAverageRideDuration(carId?: string, type?: "year" | "month"): Promise<TrendStat> {
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

        return await query.executeTakeFirst() as TrendStat;
    }

    async getMostVisitedPlaces(carId?: string, type?: "year" | "month"): Promise<Array<TopListItemStat>> {
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
}