import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, OdometerLogTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { OdometerLogType } from "../../schemas/odometerLogTypeSchema.ts";
import { OdometerLogTypeMapper } from "../mapper/odometerLogTypeMapper.ts";
import { ODOMETER_LOG_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLogType.ts";

export class OdometerLogTypeDao extends Dao<OdometerLogTypeTableRow, OdometerLogType, OdometerLogTypeMapper> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, ODOMETER_LOG_TYPE_TABLE, new OdometerLogTypeMapper());
    }
}