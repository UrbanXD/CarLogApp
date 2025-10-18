import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Expense } from "../../schemas/expenseSchema.ts";
import { EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/expense.ts";
import { ExpenseTypeDao } from "./ExpenseTypeDao.ts";
import { ExpenseMapper, SelectExpenseTableRow } from "../mapper/expenseMapper.ts";
import { CursorOptions, CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";
import { FilterCondition } from "../../../../database/paginator/AbstractPaginator.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";
import { ExpenseFields } from "../../schemas/form/expenseForm.ts";
import { SelectQueryBuilder } from "kysely";
import { FUEL_LOG_TABLE } from "../../../../database/connector/powersync/tables/fuelLog.ts";

export class ExpenseDao extends Dao<ExpenseTableRow, Expense, ExpenseMapper, SelectExpenseTableRow> {
    constructor(
        db: Kysely<DatabaseType>,
        expenseTypeDao: ExpenseTypeDao,
        currencyDao: CurrencyDao
    ) {
        super(
            db,
            EXPENSE_TABLE,
            new ExpenseMapper(expenseTypeDao, currencyDao)
        );
    }

    selectQuery(): SelectQueryBuilder<DatabaseType, SelectExpenseTableRow> {
        return this.db
        .selectFrom(EXPENSE_TABLE)
        .leftJoin(FUEL_LOG_TABLE, `${ FUEL_LOG_TABLE }.expense_id`, `${ EXPENSE_TABLE }.id`)
        .selectAll(EXPENSE_TABLE)
        .select([
            eb => eb.ref(`${ FUEL_LOG_TABLE }.id`).as("related_id")
            // eb => eb.fn.coalesce(`${ FUEL_LOG_TABLE }.id`).as("related_id")
        ]);
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
                baseQuery: this.selectQuery(),
                perPage,
                filterBy,
                mapper: this.mapper.toDto.bind(this.mapper)
            }
        );
    }
}