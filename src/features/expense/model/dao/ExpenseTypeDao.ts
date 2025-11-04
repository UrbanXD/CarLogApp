import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ExpenseTypeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeMapper } from "../mapper/expenseTypeMapper.ts";
import { EXPENSE_TYPE_TABLE } from "../../../../database/connector/powersync/tables/expenseType.ts";
import { ExpenseType } from "../../schemas/expenseTypeSchema.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { ExpenseTypeEnum } from "../enums/ExpenseTypeEnum.ts";

export class ExpenseTypeDao extends Dao<ExpenseTypeTableRow, ExpenseType, ExpenseTypeMapper> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, EXPENSE_TYPE_TABLE, new ExpenseTypeMapper());
    }

    async getAllOtherExpenseType(): Promise<Array<ExpenseType>> {
        const entities = await this.db
        .selectFrom(EXPENSE_TYPE_TABLE)
        .selectAll()
        .where("key", "is not", ExpenseTypeEnum.FUEL)
        .where("key", "is not", ExpenseTypeEnum.SERVICE)
        .execute();

        return await this.mapper.toDtoArray(entities);
    }

    async getIdByKey(key: string, safe?: boolean = true): Promise<string | null> {
        const result = await this.db
        .selectFrom(EXPENSE_TYPE_TABLE)
        .select("id")
        .where("key", "=", key)
        .executeTakeFirst();

        if(safe && !result?.id) throw new Error(`Table item not found by ${ key } key. [${ this.table }]`);

        return result?.id ? result.id : null;
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