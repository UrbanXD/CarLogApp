import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, USER_TABLE, UserTableType } from "../../../../database/connector/powersync/AppSchema.ts";

export class UserDAO {
    db: Kysely<DatabaseType>;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getUser(userId: string) {
        return await this.db
        .selectFrom(USER_TABLE)
        .selectAll()
        .where("id", "=", userId)
        .executeTakeFirstOrThrow() as UserTableType;
    }

    async insertUser(user: UserTableType) {
        try {
            await this.db
            .insertInto(USER_TABLE)
            .values(user)
            .execute();

            return user;
        } catch(e) {
            return null;
        }
    }

    async editUser(user: UserTableType) {
        await this.db
        .updateTable(USER_TABLE)
        .set(user)
        .where("id", "=", user.id)
        .executeTakeFirstOrThrow();

        return user;
    }
}