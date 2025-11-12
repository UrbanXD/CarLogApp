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
import { SERVICE_LOG_TABLE } from "../../../../database/connector/powersync/tables/serviceLog.ts";
import { SERVICE_ITEM_TABLE } from "../../../../database/connector/powersync/tables/serviceItem.ts";

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