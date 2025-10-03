import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ExpenseTypeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeMapper } from "../mapper/expenseTypeMapper.ts";
import { EXPENSE_TYPE_TABLE } from "../../../../database/connector/powersync/tables/expenseType.ts";
import { ExpenseType } from "../../schemas/expenseTypeSchema.ts";
import { Dao } from "../../../../database/dao/Dao.ts";

export class ExpenseTypeDao extends Dao<ExpenseTypeTableRow, ExpenseType, ExpenseTypeMapper> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, EXPENSE_TYPE_TABLE, new ExpenseTypeMapper());
    }

    async delete(id: string): Promise<string> {
        const result = await this.db
        .deleteFrom(EXPENSE_TYPE_TABLE)
        .where("owner_id", "is not", null)
        .where("id", "=", id)
        .returning("id")
        .executeTakeFirstOrThrow();

        return result.id;
    }
}