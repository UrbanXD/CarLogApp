import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeMapper } from "../mapper/expenseTypeMapper.ts";
import { EXPENSE_TYPE_TABLE } from "../../../../database/connector/powersync/tables/expenseType.ts";
import { ExpenseType } from "../../schemas/expenseTypeSchema.ts";

export class ExpenseTypeDao {
    private readonly db: Kysely<DatabaseType>;
    readonly mapper: ExpenseTypeMapper;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
        this.mapper = new ExpenseTypeMapper();
    }

    async getExpenseTypes(): Promise<Array<ExpenseType>> {
        const expenseTypes = await this.db
        .selectFrom(EXPENSE_TYPE_TABLE)
        .selectAll()
        .execute();

        return this.mapper.toExpenseTypeArrayDto(expenseTypes);
    }

    async getExpenseTypeById(id: string): Promise<ExpenseType> {
        const expenseTypeRow = await this.db
        .selectFrom(EXPENSE_TYPE_TABLE)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

        return this.mapper.toExpenseTypeDto(expenseTypeRow);
    }

    async deleteExpenseTypeById(id: string): Promise<string> {
        const result = await this.db
        .deleteFrom(EXPENSE_TYPE_TABLE)
        .where("owner_id", "is not", null)
        .where("id", "=", id)
        .returning("id")
        .executeTakeFirstOrThrow();

        return result.id;
    }
}