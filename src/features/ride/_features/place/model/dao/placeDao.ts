import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, PlaceTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { PLACE_TABLE } from "../../../../../../database/connector/powersync/tables/place.ts";
import { Place } from "../../schemas/placeSchema.ts";
import { PlaceMapper } from "../mapper/placeMapper.ts";
import { PlaceFormFields } from "../../schemas/form/placeForm.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { UseInfiniteQueryOptions } from "../../../../../../database/hooks/useInfiniteQuery.ts";
import { USER_TABLE } from "../../../../../../database/connector/powersync/tables/user.ts";

export class PlaceDao extends Dao<PlaceTableRow, Place, PlaceMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, PLACE_TABLE, new PlaceMapper());
    }

    timelineInfiniteQuery(ownerId: string | null): UseInfiniteQueryOptions<ReturnType<PlaceDao["selectQuery"]>, Place> {
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
                    key: USER_TABLE,
                    filters: [{ field: "owner_id", operator: "=", value: ownerId }],
                    logic: "AND"
                }
            ],
            mapper: this.mapper.toDto.bind(this.mapper)
        };
    }

    pickerInfiniteQuery(ownerId: string | null): UseInfiniteQueryOptions<ReturnType<PlaceDao["selectQuery"]>, PickerItemType> {
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
                    key: USER_TABLE,
                    filters: [{ field: "owner_id", operator: "=", value: ownerId }],
                    logic: "AND"
                }
            ],
            idField: "id",
            mapper: this.mapper.toPickerItem.bind(this.mapper),
            mappedItemId: "value"
        };
    }

    async isNameAlreadyExists(id: string, ownerId: string, name: string): Promise<boolean> {
        const result = await this.db
        .selectFrom(PLACE_TABLE)
        .select("id")
        .where("name", "=", name)
        .where("owner_id", "=", ownerId)
        .where("id", "!=", id)
        .executeTakeFirst();

        return !result;
    }

    async createFromFormResult(formResult: PlaceFormFields) {
        const entity = this.mapper.formResultToEntity(formResult);
        return await super.create(entity);
    }

    async updateFromFormResult(formResult: PlaceFormFields) {
        const entity = this.mapper.formResultToEntity(formResult);
        return super.update(entity);
    }
}