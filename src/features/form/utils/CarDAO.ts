import { Kysely } from "@powersync/kysely-driver";
import { CARS_TABLE, CarsType, DatabaseType } from "../../core/utils/database/AppSchema";
import { PhotoAttachmentQueue } from "../../core/utils/database/PhotoAttachmentQueue";

export class CarDAO {
    db: Kysely<DatabaseType>
    attachmentQueue?: PhotoAttachmentQueue

    constructor(db: Kysely<DatabaseType>, attachmentQueue?: PhotoAttachmentQueue) {
        this.db = db;
        this.attachmentQueue = attachmentQueue;
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

        if(this.attachmentQueue) {
            // await this.attachmentQueue.savePhoto();
        }

        return car;
    }

    async deleteCar(uid: string){

    }
}
export type CarDAOType = typeof CarDAO["prototype"];