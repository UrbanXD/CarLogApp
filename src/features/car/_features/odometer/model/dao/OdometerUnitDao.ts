import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, OdometerUnitTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerUnitMapper } from "../mapper/odometerUnitMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ODOMETER_UNIT_TABLE } from "../../../../../../database/connector/powersync/tables/odometerUnit.ts";
import { OdometerUnit } from "../../schemas/odometerUnitSchema.ts";
import { CAR_TABLE } from "../../../../../../database/connector/powersync/tables/car.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";

export class OdometerUnitDao extends Dao<OdometerUnitTableRow, OdometerUnit, OdometerUnitMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, ODOMETER_UNIT_TABLE, new OdometerUnitMapper());
    }

    async getUnitByCarId(carId: string): Promise<OdometerUnit> {
        const tmpResult = await this.db
        .selectFrom(CAR_TABLE)
        .select("odometer_unit_id")
        .where("id", "=", carId)
        .executeTakeFirstOrThrow();

        const result = await super.getById(tmpResult.odometer_unit_id);
        if(!result) throw new Error(`Could not get ${ tmpResult.odometer_unit_id } [odometer unit getUnitByCarId]`);
        return result;
    }
}