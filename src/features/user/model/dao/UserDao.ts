import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { USER_TABLE } from "../../../../database/connector/powersync/tables/user.ts";
import { UserMapper } from "../mapper/userMapper.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { EditUserAvatarRequest } from "../../schemas/form/editUserAvatarRequest.ts";
import { AVATAR_COLOR } from "../../../../constants/index.ts";
import { EditUserInformationRequest } from "../../schemas/form/editUserInformation.ts";

export class UserDao extends Dao<UserTableRow, UserAccount, UserMapper> {
    private readonly attachmentQueue?: PhotoAttachmentQueue;

    constructor(db: Kysely<DatabaseType>, currencyDao: CurrencyDao, attachmentQueue?: PhotoAttachmentQueue) {
        super(db, USER_TABLE, new UserMapper(currencyDao, attachmentQueue));
        this.attachmentQueue = attachmentQueue;
    }

    async getPreviousAvatarImagePath(id: string): Promise<string | null> {
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

    async updateUserInformation(userId: string, request: EditUserInformationRequest): Promise<void> {
        const user: Partial<UserTableRow> = {
            firstname: request.firstname,
            lastname: request.lastname,
            currency_id: request.currencyId
        };
        await this.db
        .updateTable(USER_TABLE)
        .set(user)
        .where("id", "=", userId)
        .returning("id")
        .executeTakeFirst();
    }

    async updateAvatar(userId: string, request: EditUserAvatarRequest): Promise<void> {
        const previousAvatarPath = await this.getPreviousAvatarImagePath(userId);
        const user: Partial<UserTableRow> = {};

        let path = previousAvatarPath;
        if(this.attachmentQueue && request.isImageAvatar) {
            path = await this.attachmentQueue.changeEntityAttachment(
                request.avatar ?? null,
                previousAvatarPath,
                userId
            );
        }

        if(!request.isImageAvatar) {
            user.avatar_url = null;
            user.avatar_color = request.avatarColor ?? AVATAR_COLOR[0];

            if(this.attachmentQueue && previousAvatarPath) await this.attachmentQueue.deleteFile(previousAvatarPath);
        } else {
            user.avatar_url = path;
        }

        if(Object.keys(user).length === 0) throw "Nothing changed";

        await this.db
        .updateTable(USER_TABLE)
        .set(user)
        .where("id", "=", userId)
        .returning("id")
        .executeTakeFirst();
    }

    async delete(id: string, safe: boolean = true): Promise<string | number | null> {
        try {
            const user = await this.getById(id);

            if(user?.avatarPath && this.attachmentQueue) {
                await this.attachmentQueue.deleteFile(user.avatarPath);
            }
        } catch(e) {
            console.log("User image cannot be deleted: ", e);
        }

        return super.delete(id, safe);
    }
}