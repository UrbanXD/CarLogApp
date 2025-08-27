import { UserTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { UserDto } from "../types/user.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { getImageFromAttachmentQueue } from "../../../../database/utils/getImageFromAttachmentQueue.ts";

export const toUserDto = async (user?: UserTableType, attachmentQueue?: PhotoAttachmentQueue): UserDto => {
    if(!user) return null;

    let userAvatar = await getImageFromAttachmentQueue(attachmentQueue, user.avatarImage);

    return {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        avatarColor: user.avatarColor,
        userAvatar: userAvatar
    };
};

export const toUserEntity = (userDto: UserDto): UserTableType => {
    return {
        id: userDto.id,
        email: userDto.email,
        firstname: userDto.firstname,
        lastname: userDto.lastname,
        avatarColor: userDto.avatarColor,
        avatarImage: userDto.userAvatar?.path ?? null
    };
};