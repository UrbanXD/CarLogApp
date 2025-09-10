import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, OdometerTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Odometer } from "../../schemas/odometerSchema.ts";
import { OdometerMapper } from "../mapper/odometerMapper.ts";
import { ODOMETER_TABLE } from "../../../../database/connector/powersync/tables/odometer.ts";

export class OdometerDao {
    private readonly db: Kysely<DatabaseType>;
    readonly mapper: OdometerMapper;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
        this.mapper = new OdometerMapper();
    }

    async getOdometerByCarId(carId: string): Promise<Odometer> {
        const odometerRow: OdometerTableRow = await this.db
        .selectFrom(ODOMETER_TABLE)
        .selectAll()
        .where("car_id", "=", carId)
        .executeTakeFirstOrThrow();

        return this.mapper.toOdometerDto(odometerRow);
    }
}