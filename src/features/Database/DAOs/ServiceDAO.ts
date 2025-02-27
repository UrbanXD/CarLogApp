import { Kysely } from "@powersync/kysely-driver";
import {DatabaseType, SERVICE_TABLE, ServiceTableType} from "../connector/powersync/AppSchema";
import {convertTableTypeToRowType} from "../utils/convertTableTypeToRowType";

export class ServiceDAO {
    db: Kysely<DatabaseType>

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async addService(service: ServiceTableType) {
        await this.db
            .insertInto(SERVICE_TABLE)
            .values(convertTableTypeToRowType(service))
            .execute()

        return service;
    }
}