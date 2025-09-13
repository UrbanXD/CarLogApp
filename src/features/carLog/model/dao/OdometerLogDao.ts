import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, OdometerLogTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ODOMETER_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerLog.ts";
import { OdometerLogMapper } from "../mapper/odometerLogMapper.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";

export class OdometerLogDao {
    private readonly db: Kysely<DatabaseType>;
    readonly mapper: OdometerLogMapper;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
        this.mapper = new OdometerLogMapper();
    }

    async createOdometerLog(odometerLog: OdometerLogTableRow): Promise<OdometerLog> {
        const insertedOdometerLog: OdometerLogTableRow = await this.db
        .insertInto(ODOMETER_LOG_TABLE)
        .values(odometerLog)
        .returningAll()
        .executeTakeFirstOrThrow();

        return this.mapper.toOdometerLogDto(insertedOdometerLog);
    }

    async getOdometerLogByCarId(carId: string): Promise<Array<OdometerLog>> {
        const odometerLogRowArray: Array<OdometerLogTableRow> = await this.db
        .selectFrom(ODOMETER_LOG_TABLE)
        .selectAll()
        .where("car_id", "=", carId)
        .execute();

        return this.mapper.toOdometerLogDtoArray(odometerLogRowArray);
    }
}