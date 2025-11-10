import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, RideExpenseTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { RideExpense } from "../../schemas/rideExpenseSchema.ts";
import { RideExpenseMapper } from "../mapper/rideExpenseMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ExpenseDao } from "../../../../../expense/model/dao/ExpenseDao.ts";
import { RIDE_EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/rideExpense.ts";
import { CarDao } from "../../../../../car/model/dao/CarDao.ts";

export class RideExpenseDao extends Dao<RideExpenseTableRow, RideExpense, RideExpenseMapper> {
    constructor(
        db: Kysely<DatabaseType>,
        carDao: CarDao,
        expenseDao: ExpenseDao
    ) {
        super(db, RIDE_EXPENSE_TABLE, new RideExpenseMapper(carDao, expenseDao));
    }

    async getAllByRideLogId(rideLogId: string): Promise<Array<RideExpense>> {
        const entities = await super.selectQuery().whereRef("ride_log_id", "=", rideLogId).execute();

        return this.mapper.toDtoArray(entities);
    }
}