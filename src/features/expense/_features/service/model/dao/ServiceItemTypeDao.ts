import { Dao } from "../../../../../../database/dao/Dao.ts";
import { ServiceItemType } from "../../schemas/serviceItemTypeSchema.ts";
import { DatabaseType, ServiceItemTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceItemTypeMapper } from "../mapper/ServiceItemTypeMapper.ts";
import { SERVICE_ITEM_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItemType.ts";
import { Kysely } from "@powersync/kysely-driver";
import { CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";

export class ServiceItemTypeDao extends Dao<ServiceItemTypeTableRow, ServiceItemType, ServiceItemTypeMapper> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, SERVICE_ITEM_TYPE_TABLE, new ServiceItemTypeMapper());
    }

    async getIdByKey(key: string, safe?: boolean = true): Promise<string | null> {
        const result = await this.db
        .selectFrom(SERVICE_ITEM_TYPE_TABLE)
        .select("id")
        .where("key", "=", key)
        .executeTakeFirst();

        if(safe && !result?.id) throw new Error(`Table item not found by ${ key } key. [${ SERVICE_ITEM_TYPE_TABLE }]`);

        return result?.id ? result.id : null;
    }

    async delete(id: string): Promise<string> {
        const result = await this.db
        .deleteFrom(SERVICE_ITEM_TYPE_TABLE)
        .where("owner_id", "is not", null)
        .where("id", "=", id)
        .returning("id")
        .executeTakeFirstOrThrow();

        return result.id;
    }

    paginator(perPage?: number = 20): CursorPaginator<ServiceItemTypeTableRow, PickerItemType> {
        return new CursorPaginator<ServiceItemTypeTableRow, PickerItemType>(
            this.db,
            SERVICE_ITEM_TYPE_TABLE,
            { cursor: [{ field: "key" }, { field: "id" }], order: "asc" },
            {
                perPage,
                mapper: this.mapper.entityToPickerItem.bind(this.mapper)
            }
        );
    }
}