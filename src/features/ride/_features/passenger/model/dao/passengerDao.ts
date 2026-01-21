import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, PassengerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { Passenger } from "../../schemas/passengerSchema.ts";
import { PassengerMapper } from "../mapper/passengerMapper.ts";
import { PassengerFormFields } from "../../schemas/form/passengerForm.ts";
import { PASSENGER_TABLE } from "../../../../../../database/connector/powersync/tables/passenger.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";

export class PassengerDao extends Dao<PassengerTableRow, Passenger, PassengerMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, PASSENGER_TABLE, new PassengerMapper());
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

    async createFromFormResult(formResult: PassengerFormFields) {
        const entity = this.mapper.formResultToEntity(formResult);
        return await super.create(entity);
    }

    async updateFromFormResult(formResult: PassengerFormFields) {
        const entity = this.mapper.formResultToEntity(formResult);
        return super.update(entity);
    }

    paginator(perPage: number = 30): CursorPaginator<PassengerTableRow, Passenger> {
        return new CursorPaginator<PassengerTableRow, Passenger>(
            this.db,
            PASSENGER_TABLE,
            { cursor: [{ field: "name", order: "asc", toLowerCase: true }, { field: "id" }], defaultOrder: "asc" },
            {
                perPage,
                mapper: this.mapper.toDto.bind(this.mapper)
            }
        );
    }

    pickerPaginator(perPage: number = 30): CursorPaginator<PassengerTableRow, PickerItemType> {
        return new CursorPaginator<PassengerTableRow, PickerItemType>(
            this.db,
            PASSENGER_TABLE,
            { cursor: [{ field: "name", order: "asc", toLowerCase: true }, { field: "id" }], defaultOrder: "asc" },
            {
                perPage,
                mapper: this.mapper.entityToPickerItem.bind(this.mapper)
            }
        );
    }
}