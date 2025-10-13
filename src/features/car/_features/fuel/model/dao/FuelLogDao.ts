import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, FuelLogTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelLog } from "../../schemas/fuelLogSchema.ts";
import { FuelLogMapper } from "../mapper/fuelLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { CarDao } from "../../../../model/dao/CarDao.ts";
import { ExpenseTypeDao } from "../../../../../expense/model/dao/ExpenseTypeDao.ts";
import { FuelUnitDao } from "./FuelUnitDao.ts";
import { FUEL_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/fuelLog.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";

export class FuelLogDao extends Dao<FuelLogTableRow, FuelLog, FuelLogMapper> {
    constructor(
        db: Kysely<DatabaseType>,
        fuelUnitDao: FuelUnitDao,
        expenseTypeDao: ExpenseTypeDao,
        carDao: CarDao
    ) {
        super(db, FUEL_LOG_TABLE, new FuelLogMapper(fuelUnitDao, expenseTypeDao, carDao));
    }

    async getByExpenseId(expenseId: string, safe?: boolean = true): Promise<FuelLog | null> {
        const fuelLogRow = await this.db
        .selectFrom(FUEL_LOG_TABLE)
        .innerJoin(EXPENSE_TABLE, `${ EXPENSE_TABLE }.id`, `${ FUEL_LOG_TABLE }.expense_id`)
        .selectAll(FUEL_LOG_TABLE)
        .select([
            `${ EXPENSE_TABLE }.car_id as car_id`,
            `${ EXPENSE_TABLE }.amount as amount`,
            `${ EXPENSE_TABLE }.original_amount as original_amount`,
            `${ EXPENSE_TABLE }.exchange_rate as exchange_rate`
        ])
        .where(`${ FUEL_LOG_TABLE }.expense_id`, "=", expenseId)
        .executeTakeFirst();

        if(!fuelLogRow && safe) throw new Error(`Table item not found by ${ expenseId } expense id [${ FUEL_LOG_TABLE }]`);

        return fuelLogRow ? await this.mapper.toDto(fuelLogRow) : null;
    }
}