import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ExpenseTypeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeMapper } from "../mapper/expenseTypeMapper.ts";
import { EXPENSE_TYPE_TABLE } from "../../../../database/connector/powersync/tables/expenseType.ts";
import { ExpenseType } from "../../schemas/expenseTypeSchema.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { ExpenseTypeEnum } from "../enums/ExpenseTypeEnum.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { UseInfiniteQueryOptions } from "../../../../database/hooks/useInfiniteQuery.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";

export class ExpenseTypeDao extends Dao<ExpenseTypeTableRow, ExpenseType, ExpenseTypeMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, EXPENSE_TYPE_TABLE, new ExpenseTypeMapper());
    }

    pickerInfiniteQuery(getTitle?: (entity: ExpenseTypeTableRow) => string): UseInfiniteQueryOptions<ReturnType<ExpenseTypeDao["selectQuery"]>, PickerItemType> {
        return {
            baseQuery: this.selectQuery()
            .where("key", "is not", ExpenseTypeEnum.FUEL)
            .where("key", "is not", ExpenseTypeEnum.SERVICE),
            defaultCursorOptions: {
                cursor: [
                    { field: "key", order: "asc", toLowerCase: true },
                    { field: "id", order: "asc" }
                ],
                defaultOrder: "asc"
            },
            idField: "id",
            mappedItemId: "value",
            mapper: (entity) => this.mapper.toPickerItem(entity, getTitle)
        };
    }

    async getIdByKey(key: string): Promise<string> {
        const result = await this.db
        .selectFrom(EXPENSE_TYPE_TABLE)
        .select("id")
        .where("key", "=", key)
        .executeTakeFirstOrThrow();

        return result.id;
    }

    async getByKey(key: string): Promise<ExpenseType> {
        const result = await this.db
        .selectFrom(EXPENSE_TYPE_TABLE)
        .selectAll()
        .where("key", "=", key)
        .executeTakeFirstOrThrow();

        return this.mapper.toDto(result);
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