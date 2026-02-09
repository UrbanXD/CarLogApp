import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, FuelUnitTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { Kysely } from "@powersync/kysely-driver";
import { FuelUnitMapper } from "../mapper/fuelUnitMapper.ts";
import { FUEL_UNIT_TABLE } from "../../../../../../database/connector/powersync/tables/fuelUnit.ts";
import { FuelUnit } from "../../schemas/fuelUnitSchema.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";

export class FuelUnitDao extends Dao<FuelUnitTableRow, FuelUnit, FuelUnitMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, FUEL_UNIT_TABLE, new FuelUnitMapper());
    }
}