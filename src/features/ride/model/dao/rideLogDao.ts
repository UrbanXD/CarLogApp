import { Dao } from "../../../../database/dao/Dao.ts";
import { DatabaseType, RideLogTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { RideLog } from "../../schemas/rideLogSchema.ts";
import { RideLogMapper } from "../mapper/rideLogMapper.ts";
import { Kysely, sql } from "@powersync/kysely-driver";
import { OdometerLogDao } from "../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { OdometerUnitDao } from "../../../car/_features/odometer/model/dao/OdometerUnitDao.ts";
import { CarDao } from "../../../car/model/dao/CarDao.ts";
import { RIDE_LOG_TABLE } from "../../../../database/connector/powersync/tables/rideLog.ts";
import { RideExpenseDao } from "./rideExpenseDao.ts";
import { RidePlaceDao } from "../../_features/place/model/dao/ridePlaceDao.ts";
import { RidePassengerDao } from "../../_features/passenger/model/dao/ridePassengerDao.ts";
import { RideLogFormFields } from "../../schemas/form/rideLogForm.ts";
import { ODOMETER_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerLog.ts";
import { RIDE_EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/rideExpense.ts";
import { RIDE_PLACE_TABLE } from "../../../../database/connector/powersync/tables/ridePlace.ts";
import { RIDE_PASSENGER_TABLE } from "../../../../database/connector/powersync/tables/ridePassenger.ts";
import { EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/expense.ts";
import { CursorOptions, CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";
import { PaginatorOptions } from "../../../../database/paginator/AbstractPaginator.ts";

export class RideLogDao extends Dao<RideLogTableRow, RideLog, RideLogMapper> {
    constructor(
        db: Kysely<DatabaseType>,
        rideExpenseDao: RideExpenseDao,
        ridePlaceDao: RidePlaceDao,
        ridePassengerDao: RidePassengerDao,
        odometerLogDao: OdometerLogDao,
        odometerUnitDao: OdometerUnitDao,
        carDao: CarDao
    ) {
        super(
            db,
            RIDE_LOG_TABLE,
            new RideLogMapper(rideExpenseDao, ridePlaceDao, ridePassengerDao, odometerLogDao, odometerUnitDao, carDao)
        );
    }

    async getUpcomingRides(carId: string, startTime: string): Promise<Array<RideLog>> {
        const result = await this.selectQuery()
        .where("car_id", "=", carId)
        .where("start_time", ">=", startTime)
        .orderBy("start_time", "asc")
        .execute();

        return await this.mapper.toDtoArray(result);
    }

    async create(formResult: RideLogFormFields): Promise<RideLog | null> {
        const {
            rideLog,
            expenses,
            rideExpenses,
            ridePlaces,
            ridePassengers,
            startOdometerLog,
            endOdometerLog
        } = await this.mapper.formResultToEntities(formResult);

        const insertedRideLogId = await this.db.transaction().execute(async (trx) => {
            await trx
            .insertInto(ODOMETER_LOG_TABLE)
            .values(startOdometerLog)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .insertInto(ODOMETER_LOG_TABLE)
            .values(endOdometerLog)
            .returning("id")
            .executeTakeFirstOrThrow();

            const result = await trx
            .insertInto(RIDE_LOG_TABLE)
            .values(rideLog)
            .returning("id")
            .executeTakeFirstOrThrow();

            const expenseArray = Array.from(expenses.values());
            if(expenseArray.length >= 1) {
                await trx
                .insertInto(EXPENSE_TABLE)
                .values(expenseArray)
                .returning("id")
                .execute();
            }

            const rideExpenseArray = Array.from(rideExpenses.values());
            if(rideExpenseArray.length >= 1) {
                await trx
                .insertInto(RIDE_EXPENSE_TABLE)
                .values(rideExpenseArray)
                .returning("id")
                .execute();
            }

            const ridePlaceArray = Array.from(ridePlaces.values());
            if(ridePlaceArray.length >= 1) {
                await trx
                .insertInto(RIDE_PLACE_TABLE)
                .values(ridePlaceArray)
                .returning("id")
                .execute();
            }

            const ridePassengerArray = Array.from(ridePassengers.values());
            if(ridePassengerArray.length >= 1) {
                await trx
                .insertInto(RIDE_PASSENGER_TABLE)
                .values(ridePassengerArray)
                .returning("id")
                .execute();
            }

            return result.id;
        });

        return await this.getById(insertedRideLogId);
    }

    async update(formResult: RideLogFormFields): Promise<RideLog | null> {
        const {
            rideLog,
            expenses,
            rideExpenses,
            ridePlaces,
            ridePassengers,
            startOdometerLog,
            endOdometerLog
        } = await this.mapper.formResultToEntities(formResult);

        const updatedRideLogId = await this.db.transaction().execute(async (trx) => {
            await trx
            .updateTable(ODOMETER_LOG_TABLE)
            .set(startOdometerLog)
            .where("id", "=", startOdometerLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .updateTable(ODOMETER_LOG_TABLE)
            .set(endOdometerLog)
            .where("id", "=", endOdometerLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            const result = await trx
            .updateTable(RIDE_LOG_TABLE)
            .set(rideLog)
            .where("id", "=", rideLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            const originalRideExpenses = await trx
            .selectFrom(RIDE_EXPENSE_TABLE)
            .select(["id", "expense_id"])
            .where("ride_log_id", "=", rideLog.id)
            .execute();

            for(const originalRideExpense of originalRideExpenses) {
                const newExpense = expenses.get(originalRideExpense.expense_id);
                if(newExpense) {
                    await trx
                    .updateTable(EXPENSE_TABLE)
                    .set(newExpense)
                    .where("id", "=", newExpense.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    expenses.delete(newExpense.id);
                } else {
                    await trx
                    .deleteFrom(EXPENSE_TABLE)
                    .where("id", "=", originalRideExpense.expense_id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }

                const newRideExpense = rideExpenses.get(originalRideExpense.id);
                if(newRideExpense) {
                    await trx
                    .updateTable(RIDE_EXPENSE_TABLE)
                    .set(newRideExpense)
                    .where("id", "=", newRideExpense.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    rideExpenses.delete(newRideExpense.id);
                } else {
                    await trx
                    .deleteFrom(RIDE_EXPENSE_TABLE)
                    .where("id", "=", originalRideExpense.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const expenseArray = Array.from(expenses.values());
            if(expenseArray.length >= 1) {
                await trx
                .insertInto(EXPENSE_TABLE)
                .values(expenseArray)
                .returning("id")
                .execute();
            }

            const rideExpenseArray = Array.from(rideExpenses.values());
            if(rideExpenseArray.length >= 1) {
                await trx
                .insertInto(RIDE_EXPENSE_TABLE)
                .values(rideExpenseArray)
                .returning("id")
                .execute();
            }

            const originalRidePlaces = await trx
            .selectFrom(RIDE_PLACE_TABLE)
            .select("id")
            .where("ride_log_id", "=", rideLog.id)
            .execute();

            for(const originalRidePlace of originalRidePlaces) {
                const newRidePlace = ridePlaces.get(originalRidePlace.id);

                if(newRidePlace) {
                    await trx
                    .updateTable(RIDE_PLACE_TABLE)
                    .set(newRidePlace)
                    .where("id", "=", newRidePlace.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    ridePlaces.delete(newRidePlace.id);
                } else {
                    await trx
                    .deleteFrom(RIDE_PLACE_TABLE)
                    .where("id", "=", originalRidePlace.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const ridePlaceArray = Array.from(ridePlaces.values());
            if(ridePlaceArray.length >= 1) {
                await trx
                .insertInto(RIDE_PLACE_TABLE)
                .values(ridePlaceArray)
                .returning("id")
                .execute();
            }

            const originalRidePassengers = await trx
            .selectFrom(RIDE_PASSENGER_TABLE)
            .select("id")
            .where("ride_log_id", "=", rideLog.id)
            .execute();

            for(const originalRidePassenger of originalRidePassengers) {
                const newRidePassenger = ridePassengers.get(originalRidePassenger.id);
                if(newRidePassenger) {
                    await trx
                    .updateTable(RIDE_PASSENGER_TABLE)
                    .set(newRidePassenger)
                    .where("id", "=", newRidePassenger.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    ridePassengers.delete(newRidePassenger.id);
                } else {
                    await trx
                    .deleteFrom(RIDE_PASSENGER_TABLE)
                    .where("id", "=", originalRidePassenger.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const ridePassengerArray = Array.from(ridePassengers.values());
            if(ridePassengerArray.length >= 1) {
                await trx
                .insertInto(RIDE_PASSENGER_TABLE)
                .values(ridePassengerArray)
                .returning("id")
                .execute();
            }

            return result.id;
        });

        return await this.getById(updatedRideLogId);
    }

    async delete(rideLog: RideLog): Promise<string | number> {
        return await this.db.transaction().execute(async (trx) => {
            const result = await trx
            .deleteFrom(RIDE_LOG_TABLE)
            .where("id", "=", rideLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .deleteFrom(ODOMETER_LOG_TABLE)
            .where("id", "=", rideLog.startOdometer.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .deleteFrom(ODOMETER_LOG_TABLE)
            .where("id", "=", rideLog.endOdometer.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            for(const rideExpense of rideLog.rideExpenses) {
                await trx
                .deleteFrom(RIDE_EXPENSE_TABLE)
                .where("id", "=", rideExpense.id)
                .returning("id")
                .executeTakeFirstOrThrow();

                await trx
                .deleteFrom(EXPENSE_TABLE)
                .where("id", "=", rideExpense.expense.id)
                .returning("id")
                .executeTakeFirstOrThrow();
            }

            await trx
            .deleteFrom(RIDE_PLACE_TABLE)
            .where("ride_log_id", "=", result.id)
            .returning("id")
            .execute();

            await trx
            .deleteFrom(RIDE_PASSENGER_TABLE)
            .where("ride_log_id", "=", result.id)
            .returning("id")
            .execute();

            return result.id;
        });
    }

    paginator(
        cursorOptions: CursorOptions<keyof RideLogTableRow | "total_expense" | "duration">,
        filterBy?: PaginatorOptions<RideLogTableRow & { total_expense: number, duration: number | null }>["filterBy"],
        perPage?: number = 25
    ): CursorPaginator<RideLogTableRow & { total_expense: number, duration: number | null }, RideLog> {
        const query = this.db
        .with("t1", (db) =>
            db
            .selectFrom(RIDE_LOG_TABLE)
            .leftJoin(RIDE_EXPENSE_TABLE, `${ RIDE_EXPENSE_TABLE }.ride_log_id`, `${ RIDE_LOG_TABLE }.id`)
            .leftJoin(EXPENSE_TABLE, `${ EXPENSE_TABLE }.id`, `${ RIDE_EXPENSE_TABLE }.expense_id`)
            .selectAll(RIDE_LOG_TABLE)
            .select((eb) => [
                eb.fn.coalesce(eb.fn.sum(`${ EXPENSE_TABLE }.amount`), eb.val(0)).as("total_expense"),
                // @formatter:off
                sql<number>`(julianday(end_time) - julianday(start_time))* 86400`.as("duration")
                // @formatter:on
            ])
            .groupBy(`${ RIDE_LOG_TABLE }.id`)
        )
        .selectFrom("t1")
        .selectAll();

        return new CursorPaginator<RideLogTableRow & { total_expense: number }, RideLog>(
            this.db,
            "t1",
            cursorOptions,
            {
                baseQuery: query,
                perPage,
                filterBy,
                mapper: this.mapper.toDto.bind(this.mapper)
            }
        );
    }
}