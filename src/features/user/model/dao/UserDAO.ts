import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, USER_TABLE, UserTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { SupabaseConnector } from "../../../../database/connector/SupabaseConnector.ts";
import { Database } from "../../../../database/connector/Database.ts";

export class UserDAO {
    db: Kysely<DatabaseType>;
    supabaseConnector: SupabaseConnector;

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

    async insertUser(user: UserTableType) {
        await this.db
        .insertInto(USER_TABLE)
        .values(user)
        .execute();

        try {
            return await this.getUser(user.id);
        } catch(e) {
            return null;
        }
    }

    async updateUser(user: UserTableType) {
        await this.db
        .updateTable(USER_TABLE)
        .set(user)
        .where("id", "=", user.id)
        .executeTakeFirstOrThrow();

        return user;
    }
}