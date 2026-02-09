import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, MakeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { MakeMapper } from "../mapper/makeMapper.ts";
import { Make } from "../../schemas/makeSchema.ts";
import { MAKE_TABLE } from "../../../../database/connector/powersync/tables/make.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { UseInfiniteQueryOptions } from "../../../../database/hooks/useInfiniteQuery.ts";

export class MakeDao extends Dao<MakeTableRow, Make, MakeMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, MAKE_TABLE, new MakeMapper());
    }

    pickerInfiniteQuery(): UseInfiniteQueryOptions<ReturnType<MakeDao["selectQuery"]>, PickerItemType> {
        return {
            baseQuery: this.selectQuery(),
            defaultCursorOptions: {
                cursor: [
                    { field: "name", order: "asc", toLowerCase: true },
                    { field: "id", order: "asc" }
                ],
                defaultOrder: "asc"
            },
            idField: "id",
            mapper: this.mapper.toPickerItem.bind(this.mapper),
            mappedItemId: "value",
            perPage: 50
        };
    }
}