import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, FuelTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelTypeMapper } from "../mapper/fuelTypeMapper.ts";
import { FuelType } from "../../schemas/fuelTypeSchema.ts";
import { Dao } from "../../../../../../database/dao/Dao.ts";
import { FUEL_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/fuelType.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";

export class FuelTypeDao extends Dao<FuelTypeTableRow, FuelType, FuelTypeMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, FUEL_TYPE_TABLE, new FuelTypeMapper());
    }
}