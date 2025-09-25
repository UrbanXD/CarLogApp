import { Kysely } from "@powersync/kysely-driver";
import {
    DatabaseType,
    OdometerLogTableRow,
    OdometerTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { Odometer } from "../../schemas/odometerSchema.ts";
import { OdometerMapper } from "../mapper/odometerMapper.ts";
import { ODOMETER_TABLE } from "../../../../database/connector/powersync/tables/odometer.ts";
import { OdometerLogMapper } from "../mapper/odometerLogMapper.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { ODOMETER_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerLog.ts";
import { CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";

export class OdometerDao {
    private readonly db: Kysely<DatabaseType>;
    readonly mapper: OdometerMapper;
    readonly logMapper: OdometerLogMapper;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
        this.mapper = new OdometerMapper();
        this.logMapper = new OdometerLogMapper();
    }

    async getOdometerByCarId(carId: string): Promise<Odometer> {
        const odometerRow: OdometerTableRow = await this.db
        .selectFrom(ODOMETER_TABLE)
        .selectAll()
        .where("car_id", "=", carId)
        .executeTakeFirstOrThrow();

        return this.mapper.toOdometerDto(odometerRow);
    }

    async createOdometerLog(odometerLogRow: OdometerLogTableRow): Promise<OdometerLog> {
        await this.db.transaction().execute(async trx => {
            const odometerLog = await trx
            .insertInto(ODOMETER_LOG_TABLE)
            .values(odometerLogRow)
            .returningAll()
            .executeTakeFirstOrThrow();

            await trx
            .updateTable(ODOMETER_TABLE)
            .set({ value: odometerLog.value })
            .where("car_id", "=", odometerLog.car_id)
            .execute();
        });
    }

    odometerLogPaginator(carId: string, perPage?: number = 10): CursorPaginator<OdometerLogTableRow> {
        return new CursorPaginator<OdometerLogTableRow, OdometerLog>(
            this.db,
            ODOMETER_LOG_TABLE,
            {
                field: ["value", "date", "id"],
                order: ["desc", "desc", "asc"]
            },
            {
                perPage,
                filterBy: { field: "car_id", operator: "=", value: carId },
                mapper: this.logMapper.toOdometerLogDto
            }
        );
    }
}