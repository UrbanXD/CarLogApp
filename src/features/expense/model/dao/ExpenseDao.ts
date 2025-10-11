import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Expense } from "../../schemas/expenseSchema.ts";
import { EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/expense.ts";
import { ExpenseTypeDao } from "./ExpenseTypeDao.ts";
import { ExpenseMapper } from "../mapper/expenseMapper.ts";
import { CursorOptions, CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";
import { FilterCondition } from "../../../../database/paginator/AbstractPaginator.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";
import { ExpenseFields } from "../../schemas/form/expenseForm.ts";

export class ExpenseDao extends Dao<ExpenseTableRow, Expense, ExpenseMapper> {
    constructor(db: Kysely<DatabaseType>, expenseTypeDao: ExpenseTypeDao, currencyDao: CurrencyDao) {
        super(db, EXPENSE_TABLE, new ExpenseMapper(expenseTypeDao, currencyDao));
    }

    async create(formResult: ExpenseFields, safe?: boolean): Promise<Expense | null> {
        const expenseEntity = this.mapper.formResultToEntity(formResult);
        return await super.create(expenseEntity, safe);
    }

    async update(formResult: ExpenseFields, safe?: boolean): Promise<Expense | null> {
        const expenseEntity = this.mapper.formResultToEntity(formResult);
        return await super.update(expenseEntity, safe);
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