import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ModelTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ModelMapper } from "../mapper/modelMapper.ts";
import { MODEL_TABLE } from "../../../../database/connector/powersync/tables/model.ts";
import { Model } from "../../schemas/modelSchema.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { MAKE_TABLE } from "../../../../database/connector/powersync/tables/make.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { UseInfiniteQueryOptions } from "../../../../database/hooks/useInfiniteQuery.ts";

export class ModelDao extends Dao<ModelTableRow, Model, ModelMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, MODEL_TABLE, new ModelMapper());
    }

    pickerInfiniteQuery(makeId: string | null): UseInfiniteQueryOptions<ReturnType<ModelDao["selectQuery"]>, PickerItemType> {
        return {
            baseQuery: this.selectQuery(),
            defaultCursorOptions: {
                cursor: [
                    { field: "name", order: "asc", toLowerCase: true },
                    { field: "id", order: "asc" }
                ],
                defaultOrder: "asc"
            },
            defaultFilters: [
                {
                    key: MAKE_TABLE,
                    filters: [{ field: "make_id", operator: "=", value: makeId }],
                    logic: "AND"
                }
            ],
            idField: "id",
            mapper: this.mapper.toPickerItem.bind(this.mapper),
            mappedItemId: "value",
            perPage: 50
        };
    }

    async getModelYearsById(id: string): Promise<{ start?: number, end?: number }> {
        const model = await this.getById(id);

        const start = model?.startYear ? Number(model.startYear) : undefined;
        const end = model?.endYear ? Number(model.endYear) : undefined;

        return { start, end };
    }
}