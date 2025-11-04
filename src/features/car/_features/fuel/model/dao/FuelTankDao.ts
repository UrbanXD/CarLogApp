import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, FuelTankTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FUEL_TANK_TABLE } from "../../../../../../database/connector/powersync/tables/fuelTank.ts";
import { Dao } from "../../../../../../database/dao/Dao.ts";
import { FuelTypeDao } from "./FuelTypeDao.ts";
import { FuelUnitDao } from "./FuelUnitDao.ts";
import { FuelTank } from "../../schemas/fuelTankSchema.ts";
import { FuelTankMapper } from "../mapper/fuelTankMapper.ts";

export class FuelTankDao extends Dao<FuelTankTableRow, FuelTank, FuelTankMapper> {
    constructor(db: Kysely<DatabaseType>, fuelTypeDao: FuelTypeDao, fuelUnitDao: FuelUnitDao) {
        super(db, FUEL_TANK_TABLE, new FuelTankMapper(fuelTypeDao, fuelUnitDao));
    }

    async getByCarId(carId: string): Promise<FuelTank> {
        const fuelTankRow = await this.db
        .selectFrom(this.table)
        .selectAll()
        .where("car_id", "=", carId)
        .executeTakeFirstOrThrow();

        return await this.mapper.toDto(fuelTankRow);
    }
}