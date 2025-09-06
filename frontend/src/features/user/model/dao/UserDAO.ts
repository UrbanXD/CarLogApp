import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { USER_TABLE } from "../../../../database/connector/powersync/tables/user.ts";
import { toUserDto, toUserEntity } from "../mapper/index.ts";
import { User } from "../../schemas/userSchema.tsx";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";

export class UserDAO {
    db: Kysely<DatabaseType>;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getUser(userId: string, attachmentQueue?: PhotoAttachmentQueue): User {
        const user: UserTableRow = await this.db
        .selectFrom(USER_TABLE)
        .selectAll()
        .where("id", "=", userId)
        .executeTakeFirstOrThrow();

        return toUserDto(user, attachmentQueue);
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
        console.log(user, "edit ");
        try {
            const userEntity = await toUserEntity(user);
            const updatedUser: UserTableRow = await this.db
            .updateTable(USER_TABLE)
            .set(userEntity)
            .where("id", "=", user.id)
            .executeTakeFirstOrThrow();

            console.log(updatedUser);

            return toUserDto(updatedUser);
        } catch(e) {
            console.log("e ", e);
        }
    }
}