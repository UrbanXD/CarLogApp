import { Kysely } from "@powersync/kysely-driver";
import {
    DatabaseType,
    ExpenseTableRow,
    OdometerLogTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { Expense } from "../../schemas/expenseSchema.ts";
import { EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/expense.ts";
import { ExpenseTypeDao } from "./ExpenseTypeDao.ts";
import { ExpenseMapper } from "../mapper/expenseMapper.ts";
import { CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";

export class ExpenseDao {
    private readonly db: Kysely<DatabaseType>;
    readonly expenseTypeDao: ExpenseTypeDao;
    readonly mapper: ExpenseMapper;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
        this.expenseTypeDao = new ExpenseTypeDao(this.db);
        this.mapper = new ExpenseMapper(this.expenseTypeDao);
    }

    paginator(carId: string, perPage?: number = 10): CursorPaginator<OdometerLogTableRow> {
        return new CursorPaginator<ExpenseTableRow, Expense>(
            this.db,
            EXPENSE_TABLE,
            {
                field: ["date", "id"],
                order: ["desc", "asc"]
            },
            {
                perPage,
                filterBy: { field: "car_id", operator: "=", value: carId },
                mapper: this.mapper.toExpenseDto.bind(this.mapper)
            }
        );
    }

    async getExpenseById(id: string): Promise<Expense> {
        const expenseRow = await this.db
        .selectFrom(EXPENSE_TABLE)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

        return await this.mapper.toExpenseDto(expenseRow);
    }

    async deleteExpenseById(id: string): Promise<string> {
        const result = await this.db
        .deleteFrom(EXPENSE_TABLE)
        .where("id", "=", id)
        .returning("id")
        .executeTakeFirstOrThrow();

        return result.id;
    }
}