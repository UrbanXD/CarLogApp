import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, USER_TABLE, UserTableType } from "../connector/powersync/AppSchema.ts";
import { SupabaseConnector } from "../connector/SupabaseConnector.ts";
import { Database } from "../connector/Database.ts";
import {registerWebModule} from "expo";

export class UserDAO {
    db: Kysely<DatabaseType>
    supabaseConnector: SupabaseConnector

    constructor(database: Database) {
        this.db = database.db;
        this.supabaseConnector = database.supabaseConnector;
    }

    async getUser(userId: string) {
        return await this.db
            .selectFrom(USER_TABLE)
            .selectAll()
            .where("id", "=", userId)
            .executeTakeFirstOrThrow() as unknown as UserTableType;
    }

    async updateUser(user: UserTableType) {
        await this.db
            .updateTable(USER_TABLE)
            .set(user)
            .where("id", "=", user.id)
            .executeTakeFirstOrThrow();

        return await this.getUser(user.id);
    }
}