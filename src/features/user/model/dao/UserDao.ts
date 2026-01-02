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
        const previousAvatarPath = await this.getPreviousAvatarImageUrl(userId);
        let avatarPath = previousAvatarPath;

        if(request.isImageAvatar && this.attachmentQueue && !!request.avatar && previousAvatarPath !== request.avatar.fileName) {
            const newAvatar = await this.attachmentQueue.saveFile(request.avatar, userId);
            avatarPath = newAvatar.filename;

            if(previousAvatarPath) await this.attachmentQueue.deleteFile(previousAvatarPath);
        }

        const user: Partial<UserTableRow> = { avatar_url: avatarPath };
        if(!request.isImageAvatar) user.avatar_color = request.avatarColor ?? AVATAR_COLOR[0];

        await this.db
        .updateTable(USER_TABLE)
        .set(user)
        .where("id", "=", userId)
        .returning("id")
        .executeTakeFirst();
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