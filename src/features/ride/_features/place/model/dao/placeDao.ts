import { Dao } from "../../../../../../database/dao/Dao.ts";
import {
    DatabaseType,
    PlaceTableRow,
    RidePlaceTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { PLACE_TABLE } from "../../../../../../database/connector/powersync/tables/place.ts";
import { Place } from "../../schemas/placeSchema.ts";
import { PlaceMapper } from "../mapper/placeMapper.ts";
import { PlaceFormFields } from "../../schemas/form/placeForm.ts";
import { RidePlace } from "../../schemas/ridePlaceSchema.ts";
import { RidePlaceMapper } from "../mapper/ridePlaceMapper.ts";
import { RIDE_PLACE_TABLE } from "../../../../../../database/connector/powersync/tables/ridePlace.ts";

export class PlaceDao extends Dao<PlaceTableRow, Place, PlaceMapper> {
    private _ridePlaceMapper?: RidePlaceMapper;

    constructor(db: Kysely<DatabaseType>) {
        super(db, PLACE_TABLE, new PlaceMapper());
    }

    get ridePlaceMapper() {
        if(!this._ridePlaceMapper) {
            this._ridePlaceMapper = new RidePlaceMapper(this);
        }
        return this._ridePlaceMapper;
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
            { cursor: [{ field: "name", order: "asc" }, { field: "id" }], defaultOrder: "asc" },
            {
                perPage,
                mapper: this.mapper.entityToPickerItem.bind(this.mapper)
            }
        );
    }

    ridePlacePaginator(rideLogId: string, perPage?: number = 30): CursorPaginator<RidePlaceTableRow, RidePlace> {
        return new CursorPaginator<RidePlaceTableRow, RidePlace>(
            this.db,
            RIDE_PLACE_TABLE,
            { cursor: [{ field: "place_order", order: "asc" }, { field: "id" }], defaultOrder: "asc" },
            {
                perPage,
                filterBy: { filters: [{ field: "car_log_id", operator: "=", value: rideLogId }] },
                mapper: this.ridePlaceMapper.toDto.bind(this.ridePlaceMapper)
            }
        );
    }
}