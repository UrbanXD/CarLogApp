import {Context, createContext, useContext} from "react";
import {Kysely} from "@powersync/kysely-driver";
import {CARS_TABLE, CarsType, DatabaseType} from "../AppSchema";

export class CarDAO {
    db: Kysely<DatabaseType>

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getCars() {
        return await this.db
            .selectFrom(CARS_TABLE)
            .selectAll()
            .execute()
    }

    async addCar(car: CarsType) {
        await this.db
            .insertInto(CARS_TABLE)
            .values(car)
            .execute()

        return car;
    }

    async deleteCar(uid: string){

    }
}