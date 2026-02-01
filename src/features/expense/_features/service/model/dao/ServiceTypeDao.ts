import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, ServiceTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceType } from "../../schemas/serviceTypeSchema.ts";
import { ServiceTypeMapper } from "../mapper/serviceTypeMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { SERVICE_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/serviceType.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { UseInfiniteQueryOptions } from "../../../../../../database/hooks/useInfiniteQuery.ts";

export class ServiceTypeDao extends Dao<ServiceTypeTableRow, ServiceType, ServiceTypeMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, SERVICE_TYPE_TABLE, new ServiceTypeMapper());
    }

    pickerInfiniteQuery(getTitle?: (entity: ServiceTypeTableRow) => string): UseInfiniteQueryOptions<ReturnType<ServiceTypeDao["selectQuery"]>, PickerItemType> {
        return {
            baseQuery: this.selectQuery(),
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

    async delete(id: string): Promise<string> {
        const result = await this.db
        .deleteFrom(SERVICE_TYPE_TABLE)
        .where("owner_id", "is not", null)
        .where("id", "=", id)
        .returning("id")
        .executeTakeFirstOrThrow();

        return result.id;
    }
}