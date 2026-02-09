import { Dao } from "../../../../../../database/dao/Dao.ts";
import { ServiceItemType } from "../../schemas/serviceItemTypeSchema.ts";
import {
    DatabaseType,
    ServiceItemTypeTableRow,
    ServiceTypeTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceItemTypeMapper } from "../mapper/ServiceItemTypeMapper.ts";
import { SERVICE_ITEM_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItemType.ts";
import { Kysely } from "@powersync/kysely-driver";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { UseInfiniteQueryOptions } from "../../../../../../database/hooks/useInfiniteQuery.ts";

export class ServiceItemTypeDao extends Dao<ServiceItemTypeTableRow, ServiceItemType, ServiceItemTypeMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, SERVICE_ITEM_TYPE_TABLE, new ServiceItemTypeMapper());
    }

    pickerInfiniteQuery(getTitle?: (entity: ServiceTypeTableRow) => string): UseInfiniteQueryOptions<ReturnType<ServiceItemTypeDao["selectQuery"]>, PickerItemType> {
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
        .deleteFrom(SERVICE_ITEM_TYPE_TABLE)
        .where("owner_id", "is not", null)
        .where("id", "=", id)
        .returning("id")
        .executeTakeFirstOrThrow();

        return result.id;
    }
}