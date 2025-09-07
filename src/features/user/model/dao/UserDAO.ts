import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { USER_TABLE } from "../../../../database/connector/powersync/tables/user.ts";
import { toUserDto, toUserEntity } from "../mapper/index.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";

export class UserDAO {
    db: Kysely<DatabaseType>;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getUser(userId: string, attachmentQueue?: PhotoAttachmentQueue): UserAccount {
        const user: UserTableRow = await this.db
        .selectFrom(USER_TABLE)
        .selectAll()
        .where("id", "=", userId)
        .executeTakeFirstOrThrow();

        return toUserDto(user, attachmentQueue);
    }

    async insertUser(user: UserAccount) {
        try {
            const insertedUser: UserTableRow = await this.db
            .insertInto(USER_TABLE)
            .values(user)
            .returningAll()
            .executeTakeFirstOrThrow();

            return toUserDto(insertedUser);
        } catch(_e) {
            return null;
        }
    }

    async editUser(user: UserAccount) {
        try {
            const userEntity = await toUserEntity(user);
            const updatedUser: UserTableRow = await this.db
            .updateTable(USER_TABLE)
            .set(userEntity)
            .where("id", "=", user.id)
            .returningAll()
            .executeTakeFirstOrThrow();

            return toUserDto(updatedUser);
        } catch(_e) {
            return null;
        }
    }
}