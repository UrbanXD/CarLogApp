import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, RidePlaceTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { SelectQueryBuilder } from "kysely";
import { RidePlace } from "../../schemas/ridePlaceSchema.ts";
import { RidePlaceMapper, SelectRidePlaceTableRow } from "../mapper/ridePlaceMapper.ts";
import { RIDE_PLACE_TABLE } from "../../../../../../database/connector/powersync/tables/ridePlace.ts";
import { PLACE_TABLE } from "../../../../../../database/connector/powersync/tables/place.ts";

export class RidePlaceDao extends Dao<RidePlaceTableRow, RidePlace, RidePlaceMapper, SelectRidePlaceTableRow> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, RIDE_PLACE_TABLE, new RidePlaceMapper());
    }

    selectQuery(): SelectQueryBuilder<DatabaseType, SelectRidePlaceTableRow> {
        return this.db
        .selectFrom(RIDE_PLACE_TABLE)
        .innerJoin(PLACE_TABLE, `${ PLACE_TABLE }.id`, `${ RIDE_PLACE_TABLE }.place_id`)
        .selectAll(RIDE_PLACE_TABLE)
        .select(`${ PLACE_TABLE }.name`)
        .orderBy(`${ RIDE_PLACE_TABLE }.place_order`, "asc");
    }

    async getAllByRideLogId(rideLogId: string): Promise<Array<RidePlace>> {
        const entities = await (
            this.selectQuery()
            .whereRef(`${ RIDE_PLACE_TABLE }.ride_log_id`, "=", rideLogId)
            .execute()
        );

        return await this.mapper.toDtoArray(entities);
    }
}