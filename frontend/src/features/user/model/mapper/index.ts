import { UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { getImageFromAttachmentQueue } from "../../../../database/utils/getImageFromAttachmentQueue.ts";
import { User, userSchema } from "../../schemas/userSchema.tsx";

export const toUserDto = async (userRow?: UserTableRow, attachmentQueue?: PhotoAttachmentQueue): User => {
    if(!userRow) return null;

    let avatar = await getImageFromAttachmentQueue(attachmentQueue, user.avatar_url);

    return userSchema.parse({
        id: userRow.id,
        email: userRow.email,
        firstname: userRow.firstname,
        lastname: userRow.lastname,
        avatarColor: userRow.avatar_color,
        avatar
    });
};

export const toUserEntity = (user: User): UserTableRow => {
    return {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        avatar_color: user.avatarColor,
        avatar_url: user.avatar?.path ?? null
    };
};