import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, OdometerUnitTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerUnitMapper } from "../mapper/odometerUnitMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ODOMETER_UNIT_TABLE } from "../../../../../../database/connector/powersync/tables/odometerUnit.ts";
import { OdometerUnit } from "../../schemas/odometerUnitSchema.ts";

export class OdometerUnitDao extends Dao<OdometerUnitTableRow, OdometerUnit, OdometerUnitMapper> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, ODOMETER_UNIT_TABLE, new OdometerUnitMapper());
    }
}