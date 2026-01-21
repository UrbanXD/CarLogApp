import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ExpenseTypeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeMapper } from "../mapper/expenseTypeMapper.ts";
import { EXPENSE_TYPE_TABLE } from "../../../../database/connector/powersync/tables/expenseType.ts";
import { ExpenseType } from "../../schemas/expenseTypeSchema.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { ExpenseTypeEnum } from "../enums/ExpenseTypeEnum.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";

export class ExpenseTypeDao extends Dao<ExpenseTypeTableRow, ExpenseType, ExpenseTypeMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, EXPENSE_TYPE_TABLE, new ExpenseTypeMapper());
    }

    async getAllOtherExpenseType(): Promise<Array<ExpenseType>> {
        const entities = await this.db
        .selectFrom(EXPENSE_TYPE_TABLE)
        .selectAll()
        .where("key", "is not", ExpenseTypeEnum.FUEL)
        .where("key", "is not", ExpenseTypeEnum.SERVICE)
        .execute();

        return this.mapper.toDtoArray(entities);
    }

    async getIdByKey(key: string): Promise<string> {
        const result = await this.db
        .selectFrom(EXPENSE_TYPE_TABLE)
        .select("id")
        .where("key", "=", key)
        .executeTakeFirstOrThrow();

        return result.id;
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