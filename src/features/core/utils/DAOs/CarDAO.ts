import { Kysely } from "@powersync/kysely-driver";
import { CAR_TABLE, CarTableType, DatabaseType } from "../database/powersync/AppSchema";
import { convertTableTypeToRowType } from "../convertTableTypeToRowType";

export class CarDAO {
    db: Kysely<DatabaseType>

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getCars() {
        return await this.db
            .selectFrom(CAR_TABLE)
            .selectAll()
            .execute() as unknown as Array<CarTableType>;
    }

    async addCar(car: CarTableType) {
        await this.db
            .insertInto(CAR_TABLE)
            .values(convertTableTypeToRowType(car))
            .execute()

        return car;
    }

    async deleteCar(uid: string){

    }
}
export type CarDAOType = typeof CarDAO["prototype"];