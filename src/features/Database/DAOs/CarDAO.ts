import { Kysely } from "@powersync/kysely-driver";
import {CAR_TABLE, CarTableType, DatabaseType} from "../connector/powersync/AppSchema";
import {convertTableTypeToRowType} from "../utils/convertTableTypeToRowType";

export class CarDAO {
    db: Kysely<DatabaseType>

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getCar(carID: string) {
        return await this.db
            .selectFrom(CAR_TABLE)
            .selectAll()
            .where("id", "=", carID)
            .executeTakeFirstOrThrow() as unknown as CarTableType;
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

        try {
            return await this.getCar(car.id);
        } catch (e) {
            return null;
        }

    }

    async editCar(car: CarTableType) {
        await this.db
            .updateTable(CAR_TABLE)
            .set({
                ...car
            })
            .where("id", "=", car.id)
            .executeTakeFirst()

        return car;
    }

    async deleteCar(carID: string){
        await this.db
            .deleteFrom(CAR_TABLE)
            .where("id", "=", carID)
            .executeTakeFirstOrThrow()

        return carID;
    }
}
export type CarDAOType = typeof CarDAO["prototype"];