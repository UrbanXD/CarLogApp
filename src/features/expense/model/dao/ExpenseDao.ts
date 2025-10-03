import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Expense } from "../../schemas/expenseSchema.ts";
import { EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/expense.ts";
import { ExpenseTypeDao } from "./ExpenseTypeDao.ts";
import { ExpenseMapper } from "../mapper/expenseMapper.ts";
import { CursorOptions, CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";
import { FilterCondition } from "../../../../database/paginator/AbstractPaginator.ts";
import { Dao } from "../../../../database/dao/Dao.ts";

export class ExpenseDao extends Dao<ExpenseTableRow, Expense, ExpenseMapper> {
    constructor(db: Kysely<DatabaseType>, expenseTypeDao: ExpenseTypeDao) {
        super(db, EXPENSE_TABLE, new ExpenseMapper(expenseTypeDao));
    }

    paginator(
        cursorOptions: CursorOptions<keyof ExpenseTableRow>,
        filterBy?: FilterCondition<ExpenseTableRow> | Array<FilterCondition<ExpenseTableRow>>,
        perPage?: number = 10
    ): CursorPaginator<ExpenseTableRow, Expense> {
        return new CursorPaginator<ExpenseTableRow, Expense>(
            this.db,
            EXPENSE_TABLE,
            cursorOptions,
            {
                perPage,
                filterBy,
                mapper: this.mapper.toDto.bind(this.mapper)
            }
        );
    }
}