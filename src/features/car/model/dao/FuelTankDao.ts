import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../../../../database/connector/powersync/AppSchema.ts";
import { FuelTank } from "../../schemas/fuelTankSchema.ts";
import { FUEL_TANK_TABLE } from "../../../../database/connector/powersync/tables/fuelTank.ts";
import { FuelTankMapper } from "../mapper/fuelTankMapper.tsx";

export class FuelTankDao {
    private readonly db: Kysely<DatabaseType>;
    readonly mapper: FuelTankMapper;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
        this.mapper = new FuelTankMapper();
    }

    async getFuelTankByCarId(carId: string): Promise<FuelTank> {
        const fuelTankRow = await this.db
        .selectFrom(FUEL_TANK_TABLE)
        .selectAll()
        .where("car_id", "=", carId)
        .executeTakeFirstOrThrow();

        return this.mapper.toFuelTankDto(fuelTankRow);
    }
}