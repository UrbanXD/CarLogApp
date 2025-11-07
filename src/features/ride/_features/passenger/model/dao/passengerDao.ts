import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, PassengerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { Passenger } from "../../schemas/passengerSchema.ts";
import { PassengerMapper } from "../mapper/passengerMapper.ts";
import { PassengerFormFields } from "../../schemas/form/passengerForm.ts";
import { PASSENGER_TABLE } from "../../../../../../database/connector/powersync/tables/passenger.ts";

export class PassengerDao extends Dao<PassengerTableRow, Passenger, PassengerMapper> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, PASSENGER_TABLE, new PassengerMapper());
    }

    async isNameAlreadyExists(id: string, ownerId: string, name: string): Promise<boolean> {
        const result = await this.db
        .selectFrom(PASSENGER_TABLE)
        .select("id")
        .where("name", "=", name)
        .where("owner_id", "=", ownerId)
        .where("id", "!=", id)
        .executeTakeFirst();

        return !result;
    }

    async create(formResult: PassengerFormFields, safe?: boolean): Promise<Passenger | null> {
        const entity = this.mapper.formResultToEntity(formResult);
        return await super.create(entity, safe);
    }

    async update(formResult: PassengerFormFields, safe?: boolean): Promise<Passenger | null> {
        const entity = this.mapper.formResultToEntity(formResult);
        return super.update(entity, safe);
    }

    paginator(perPage?: number = 30): CursorPaginator<PassengerTableRow, PickerItemType> {
        return new CursorPaginator<PassengerTableRow, PickerItemType>(
            this.db,
            PASSENGER_TABLE,
            { cursor: [{ field: "name", order: "asc" }, { field: "id" }], order: "asc" },
            {
                perPage,
                mapper: this.mapper.entityToPickerItem.bind(this.mapper)
            }
        );
    }
}