import { Kysely, sql } from "kysely";
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

export type ExpenseTrend = {
    current: number
    previous: number
}

export type AverageCostPerDistance = {
    current: number
    previous: number
}

export type DistanceTrend = {
    current: number
    previous: number
}


export interface MonthlyConsumptionData {
    current: number;
    previous: number;
}

export class StatisticsDao {
    private db: Kysely<DatabaseType>;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getMonthlyFuelCostTrend(carId: string): Promise<ExpenseTrend> {
        const result = await this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as t1`)
        .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
        .select([
            sql<number>`SUM(CASE WHEN strftime('%Y-%m', t2.date) = strftime('%Y-%m', 'now') THEN t2.amount ELSE 0 END)`
            .as("current"),
            sql<number>`SUM(CASE WHEN strftime('%Y-%m', t2.date) = strftime('%Y-%m', 'now', 'start of month', '-1 month') THEN t2.amount ELSE 0 END)`
            .as("previous")
        ])
        .where("t2.car_id", "=", carId)
        .where("t2.date", ">=", sql`strftime
        ('%Y-%m-%d', 'now', 'start of month', '-2 month')`)
        .executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as ExpenseTrend;
    }

    async getMonthlyTotalCostTrend(carId: string): Promise<ExpenseTrend> {
        const result = await this.db
        .selectFrom(EXPENSE_TABLE)
        .select([
            sql<number>`SUM(CASE WHEN strftime('%Y-%m', date) = strftime('%Y-%m', 'now') THEN amount ELSE 0 END)`
            .as("current"),
            sql<number>`SUM(CASE WHEN strftime('%Y-%m', date) = strftime('%Y-%m', 'now', 'start of month', '-1 month') THEN amount ELSE 0 END)`.as(
                "previous")
        ])
        .where("car_id", "=", carId)
        .where("date", ">=", sql`strftime
        ('%Y-%m-%d', 'now', 'start of month', '-2 month')`)
        .executeTakeFirstOrThrow();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as ExpenseTrend;
    }

    async getMonthlyDistanceTrend(carId: string): Promise<DistanceTrend> {
        const result = await this.db
        .with("curr", (db) =>
            db.selectFrom(`${ ODOMETER_LOG_TABLE } as t1`)
            .innerJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as t2`, "t1.id", "t2.odometer_log_id")
            .innerJoin(`${ CAR_TABLE } as t3`, "t1.car_id", "t3.id")
            .innerJoin(`${ ODOMETER_UNIT_TABLE } as t4`, "t3.odometer_unit_id", "t4.id")
            .select([
                sql<number>`MIN(ROUND(t1.value / t4.conversion_factor))`.as("min"),
                sql<number>`MAX(ROUND(t1.value / t4.conversion_factor))`.as("max")
            ])
            .where("car_id", "=", carId)
            .where(sql`strftime
            ('%Y-%m', t2.date) = strftime('%Y-%m', 'now')`)
        )
        .with("prev", (db) =>
            db.selectFrom(`${ ODOMETER_LOG_TABLE } as t1`)
            .innerJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as t2`, "t1.id", "t2.odometer_log_id")
            .innerJoin(`${ CAR_TABLE } as t3`, "t1.car_id", "t3.id")
            .innerJoin(`${ ODOMETER_UNIT_TABLE } as t4`, "t3.odometer_unit_id", "t4.id")
            .select([
                sql<number>`MIN(ROUND(t1.value / t4.conversion_factor))`.as("min"),
                sql<number>`MAX(ROUND(t1.value / t4.conversion_factor))`.as("max")
            ])
            .where("car_id", "=", carId)
            .where(
                sql`strftime
                ('%Y-%m', t2.date) = strftime('%Y-%m', 'now', 'start of month', '-1 month')`
            )
        )
        .selectFrom("curr")
        .select([
            sql<number>`COALESCE(curr.max - curr.min, 0)`.as("current"),
            sql<number>`COALESCE((SELECT prev.max - prev.min FROM prev), 0)`.as("previous")
        ])
        .executeTakeFirst();

        return {
            current: numberToFractionDigit(result?.current ?? 0),
            previous: numberToFractionDigit(result?.previous ?? 0)
        } as DistanceTrend;
    }

    async getMonthlyFuelConsumption(carId: string): Promise<MonthlyConsumptionData> {
        const monthlyDistance = await this.getMonthlyDistanceTrend(carId);

        const monthlyFuelQuantity = await this.db
        .selectFrom(`${ FUEL_LOG_TABLE } as t1`)
        .innerJoin(`${ EXPENSE_TABLE } as t2`, "t1.expense_id", "t2.id")
        .innerJoin(`${ FUEL_UNIT_TABLE } as t3`, "t3.id", "t1.fuel_unit_id")
        .select([
            sql<number>`SUM(CASE WHEN strftime('%Y-%m', t2.date) = strftime('%Y-%m', 'now') THEN t1.quantity * t3.conversion_factor ELSE 0 END)`
            .as("current"),
            sql<number>`SUM(CASE WHEN strftime('%Y-%m', t2.date) = strftime('%Y-%m', 'now', 'start of month', '-1 month') THEN t1.quantity * t3.conversion_factor ELSE 0 END)`
            .as("previous")
        ])
        .where("t2.car_id", "=", carId)
        .where("t2.date", ">=", sql`strftime
        ('%Y-%m-%d', 'now', 'start of month', '-2 month')`)
        .executeTakeFirst();

        let current = 0;
        if(monthlyFuelQuantity?.current && monthlyFuelQuantity.current !== 0 && monthlyDistance.current !== 0) {
            current = numberToFractionDigit((monthlyFuelQuantity.current / monthlyDistance.current) * 100);
        }

        let previous = 0;
        if(monthlyFuelQuantity?.previous && monthlyFuelQuantity.previous !== 0 && monthlyDistance.previous !== 0) {
            previous = numberToFractionDigit((monthlyFuelQuantity.previous / monthlyDistance.previous) * 100);
        }

        return { current, previous } as MonthlyConsumptionData;
    }

    async getMonthlyCostPerDistance(carId: string): Promise<AverageCostPerDistance> {
        const monthlyCostTotal = await this.getMonthlyTotalCostTrend(carId);
        const monthlyDistance = await this.getMonthlyDistanceTrend(carId);

        return {
            current: monthlyDistance.current === 0
                     ? 0
                     : numberToFractionDigit((monthlyCostTotal.current / monthlyDistance.current) * 100),
            previous: monthlyDistance.previous === 0
                      ? 0
                      : numberToFractionDigit((monthlyCostTotal.previous / monthlyDistance.previous) * 100)
        } as AverageCostPerDistance;
    }

    async getMonthlyLongestRideDistance(carId: string): Promise<DistanceTrend> {
        const result = await this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t2`, "t1.start_odometer_log_id", "t2.id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as t3`, "t1.end_odometer_log_id", "t3.id")
        .innerJoin(`${ CAR_TABLE } as t4`, "t1.car_id", "t4.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t5`, "t4.odometer_unit_id", "t5.id")
        .select([
            sql<number>`MAX(CASE WHEN strftime('%Y-%m', t1.start_time) = strftime('%Y-%m', 'now') THEN (ROUND((t3.value - t2.value) / t5.conversion_factor)) ELSE 0 END)`
            .as("current"),
            sql<number>`MAX(CASE WHEN strftime('%Y-%m', t1.start_time) = strftime('%Y-%m', 'now', 'start of month', '-1 month') THEN (ROUND((t3.value - t2.value) / t5.conversion_factor)) ELSE 0 END)`
            .as("previous")
        ])
        .where("t1.car_id", "=", carId)
        .where("t1.start_time", ">=", sql`strftime
        ('%Y-%m-%d', 'now', 'start of month', '-2 month')`)
        .executeTakeFirstOrThrow();

        return result as DistanceTrend;
    }
}