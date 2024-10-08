import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, SERVICE_TABLE, ServiceType } from "../../core/utils/database/AppSchema";

export class ServiceDAO {
    db: Kysely<DatabaseType>

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async addService(service: ServiceType) {
        await this.db
            .insertInto(SERVICE_TABLE)
            .values(service)
            .execute()

        return service;
    }
}