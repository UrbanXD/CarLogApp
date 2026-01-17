import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, ServiceTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceType } from "../../schemas/serviceTypeSchema.ts";
import { ServiceTypeMapper } from "../mapper/serviceTypeMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { SERVICE_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/serviceType.ts";
import { CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";

export class ServiceTypeDao extends Dao<ServiceTypeTableRow, ServiceType, ServiceTypeMapper> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, SERVICE_TYPE_TABLE, new ServiceTypeMapper());
    }

    async getIdByKey(key: string, safe: boolean = true): Promise<string | null> {
        const result = await this.db
        .selectFrom(SERVICE_TYPE_TABLE)
        .select("id")
        .where("key", "=", key)
        .executeTakeFirst();

        if(safe && !result?.id) throw new Error(`Table item not found by ${ key } key. [${ this.table }]`);

        return result?.id ? result.id : null;
    }

    async delete(id: string): Promise<string> {
        const result = await this.db
        .deleteFrom(SERVICE_TYPE_TABLE)
        .where("owner_id", "is not", null)
        .where("id", "=", id)
        .returning("id")
        .executeTakeFirstOrThrow();

        return result.id;
    }

    paginator({ perPage = 20, getTitle }: {
        perPage?: number,
        getTitle?: (entity: ServiceTypeTableRow) => string
    }): CursorPaginator<ServiceTypeTableRow, PickerItemType> {
        return new CursorPaginator<ServiceTypeTableRow, PickerItemType>(
            this.db,
            SERVICE_TYPE_TABLE,
            { cursor: [{ field: "key", order: "asc", toLowerCase: true }, { field: "id" }], defaultOrder: "asc" },
            {
                perPage,
                mapper: (entity) => this.mapper.entityToPickerItem(entity, getTitle)
            }
        );
    }
}