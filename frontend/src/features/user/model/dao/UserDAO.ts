import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { USER_TABLE } from "../../../../database/connector/powersync/tables/user.ts";
import { toUserDto } from "../mapper/index.ts";
import { User } from "../../schemas/userSchema.tsx";

export class UserDAO {
    db: Kysely<DatabaseType>;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getUser(userId: string): User {
        const user: UserTableRow = await this.db
        .selectFrom(USER_TABLE)
        .selectAll()
        .where("id", "=", userId)
        .executeTakeFirstOrThrow();

        return toUserDto(user);
    }

    async insertUser(user: User) {
        try {
            const insertedUser: UserTableRow = await this.db
            .insertInto(USER_TABLE)
            .values(user)
            .executeTakeFirstOrThrow();

            return toUserDto(insertedUser);
        } catch(e) {
            return null;
        }
    }

    async editUser(user: User) {
        const updatedUser: UserTableRow = await this.db
        .updateTable(USER_TABLE)
        .set(user)
        .where("id", "=", user.id)
        .executeTakeFirstOrThrow();

        return toUserDto(updatedUser);
    }
}