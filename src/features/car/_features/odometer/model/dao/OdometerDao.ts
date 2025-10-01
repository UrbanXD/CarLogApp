import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, OdometerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerMapper } from "../mapper/odometerMapper.ts";
import { ODOMETER_TABLE } from "../../../../../../database/connector/powersync/tables/odometer.ts";
import { OdometerLogMapper } from "../mapper/odometerLogMapper.ts";
import { Dao } from "../../../../../../database/dao/Dao.ts";
import { OdometerUnitDao } from "./OdometerUnitDao.ts";
import { Odometer } from "../../schemas/odometerSchema.ts";

export class OdometerDao extends Dao<OdometerTableRow, Odometer, OdometerMapper> {
    readonly logMapper: OdometerLogMapper;

    constructor(db: Kysely<DatabaseType>, odometerUnitDao: OdometerUnitDao) {
        super(db, ODOMETER_TABLE, new OdometerMapper(odometerUnitDao));
        this.logMapper = new OdometerLogMapper(this);
    }

    async getByCarId(carId: string): Promise<Odometer> {
        const odometerRow: OdometerTableRow = await this.db
        .selectFrom(this.table)
        .selectAll()
        .where("car_id", "=", carId)
        .executeTakeFirstOrThrow();

        return await this.mapper.toDto(odometerRow);
    }
}