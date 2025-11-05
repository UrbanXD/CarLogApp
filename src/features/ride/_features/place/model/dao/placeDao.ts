import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, PlaceTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { PLACE_TABLE } from "../../../../../../database/connector/powersync/tables/place.ts";
import { Place } from "../../schemas/placeSchema.ts";
import { PlaceMapper } from "../mapper/placeMapper.ts";
import { PlaceFormFields } from "../../schemas/form/placeForm.ts";

export class PlaceDao extends Dao<PlaceTableRow, Place, PlaceMapper> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, PLACE_TABLE, new PlaceMapper());
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

    async create(formResult: PlaceFormFields, safe?: boolean): Promise<Place | null> {
        const entity = this.mapper.formResultToEntity(formResult);
        return await super.create(entity, safe);
    }

    async update(formResult: PlaceFormFields, safe?: boolean): Promise<Place | null> {
        const entity = this.mapper.formResultToEntity(formResult);
        return super.update(entity, safe);
    }

    paginator(perPage?: number = 30): CursorPaginator<PlaceTableRow, PickerItemType> {
        return new CursorPaginator<PlaceTableRow, PickerItemType>(
            this.db,
            PLACE_TABLE,
            { cursor: [{ field: "name", order: "asc" }, { field: "id" }], order: "asc" },
            {
                perPage,
                mapper: this.mapper.entityToPickerItem.bind(this.mapper)
            }
        );
    }
}