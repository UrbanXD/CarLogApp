import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, RidePassengerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { RidePassenger } from "../../schemas/ridePassengerSchema.ts";
import { RidePassengerMapper, SelectRidePassengerTableRow } from "../mapper/ridePassengerMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { PASSENGER_TABLE } from "../../../../../../database/connector/powersync/tables/passenger.ts";
import { SelectQueryBuilder } from "kysely";
import { RIDE_PASSENGER_TABLE } from "../../../../../../database/connector/powersync/tables/ridePassenger.ts";

export class RidePassengerDao extends Dao<RidePassengerTableRow, RidePassenger, RidePassengerMapper, SelectRidePassengerTableRow> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, RIDE_PASSENGER_TABLE, new RidePassengerMapper());
    }

    selectQuery(): SelectQueryBuilder<DatabaseType, SelectRidePassengerTableRow> {
        return this.db
        .selectFrom(RIDE_PASSENGER_TABLE)
        .innerJoin(PASSENGER_TABLE, `${ PASSENGER_TABLE }.id`, `${ RIDE_PASSENGER_TABLE }.passenger_id`)
        .selectAll(RIDE_PASSENGER_TABLE)
        .select(`${ PASSENGER_TABLE }.name`)
        .orderBy(`${ RIDE_PASSENGER_TABLE }.passenger_order`, "asc");
    }

    async getAllByRideLogId(rideLogId: string): Promise<Array<RidePassenger>> {
        const entities = await (
            this.selectQuery()
            .whereRef(`${ RIDE_PASSENGER_TABLE }.ride_log_id`, "=", rideLogId)
            .execute()
        );

        return await this.mapper.toDtoArray(entities);
    }
}