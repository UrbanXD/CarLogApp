import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, PassengerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { Passenger } from "../../schemas/passengerSchema.ts";
import { PassengerMapper } from "../mapper/passengerMapper.ts";
import { PassengerFormFields } from "../../schemas/form/passengerForm.ts";
import { PASSENGER_TABLE } from "../../../../../../database/connector/powersync/tables/passenger.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { UseInfiniteQueryOptions } from "../../../../../../database/hooks/useInfiniteQuery.ts";
import { USER_TABLE } from "../../../../../../database/connector/powersync/tables/user.ts";

export class PassengerDao extends Dao<PassengerTableRow, Passenger, PassengerMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, PASSENGER_TABLE, new PassengerMapper());
    }

    timelineInfiniteQuery(ownerId: string | null): UseInfiniteQueryOptions<ReturnType<PassengerDao["selectQuery"]>, Passenger> {
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

    pickerInfiniteQuery(ownerId: string | null): UseInfiniteQueryOptions<ReturnType<PassengerDao["selectQuery"]>, PickerItemType> {
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
}