import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { USER_TABLE } from "../../../../database/connector/powersync/tables/user.ts";
import { UserMapper } from "../mapper/userMapper.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";
import { Dao } from "../../../../database/dao/Dao.ts";

export class UserDao extends Dao<UserTableRow, UserAccount, UserMapper> {
    constructor(db: Kysely<DatabaseType>, currencyDao: CurrencyDao, attachmentQueue?: PhotoAttachmentQueue) {
        super(db, USER_TABLE, new UserMapper(currencyDao, attachmentQueue));
    }

    async getPreviousAvatarImageUrl(id: string): Promise<string | null> {
        const result = await this.db
        .selectFrom(USER_TABLE)
        .select("avatar_url")
        .where("id", "=", id)
        .executeTakeFirst();

        return result?.avatar_url ?? null;
    }

    async update(user: UserAccount, safe?: boolean): Promise<UserAccount | null> {
        const entity = await this.mapper.toEntity(user);
        return super.update(entity, safe);
    }

    async delete(id: string, safe?: boolean = true): Promise<string> {
        try {
            const user = await this.getById(id);

            if(user?.avatar && this.attachmentQueue) {
                await this.attachmentQueue.deleteFile(user.avatar.fileName);
            }
        } catch(e) {
            console.log("User image cannot be deleted: ", e);
        }

        return super.delete(id, safe);
    }
}