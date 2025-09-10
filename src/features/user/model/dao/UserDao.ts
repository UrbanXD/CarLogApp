import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { USER_TABLE } from "../../../../database/connector/powersync/tables/user.ts";
import { UserMapper } from "../mapper/userMapper.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";

export class UserDao {
    private readonly db: Kysely<DatabaseType>;
    private readonly attachmentQueue?: PhotoAttachmentQueue;
    readonly mapper: UserMapper;

    constructor(db: Kysely<DatabaseType>, attachmentQueue?: PhotoAttachmentQueue) {
        this.db = db;
        this.attachmentQueue = attachmentQueue;
        this.mapper = new UserMapper(this.attachmentQueue);
    }

    async getUser(userId: string): UserAccount | null {
        const user: UserTableRow | undefined = await this.db
        .selectFrom(USER_TABLE)
        .selectAll()
        .where("id", "=", userId)
        .executeTakeFirst();

        if(!user) return null;

        return this.mapper.toUserDto(user);
    }

    async insertUser(user: UserAccount) {
        try {
            const insertedUser: UserTableRow = await this.db
            .insertInto(USER_TABLE)
            .values(user)
            .returningAll()
            .executeTakeFirstOrThrow();

            return this.mapper.toUserDto(insertedUser);
        } catch(_e) {
            return null;
        }
    }

    async editUser(user: UserAccount) {
        try {
            const userEntity = this.mapper.toUserEntity(user);

            const updatedUser: UserTableRow = await this.db
            .updateTable(USER_TABLE)
            .set(userEntity)
            .where("id", "=", user.id)
            .returningAll()
            .executeTakeFirstOrThrow();

            return this.mapper.toUserDto(updatedUser);
        } catch(_e) {
            return null;
        }
    }
}