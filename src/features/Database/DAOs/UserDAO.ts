import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, USER_TABLE, UserTableType } from "../connector/powersync/AppSchema.ts";

export class UserDAO {
    db: Kysely<DatabaseType>

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
        this.supabaseConnector = supabaseConnector;
    }

    async getUser(userId: string) {
        return await this.db
            .selectFrom(USER_TABLE)
            .selectAll()
            .where("id", "=", userId)
            .executeTakeFirstOrThrow() as unknown as UserTableType;
    }
}