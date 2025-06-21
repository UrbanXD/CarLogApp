import { UserTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { Image } from "../../../../types/index.ts";

export type UserDto = Omit<UserTableType, "avatarImage"> & { userAvatar: Image | null }

export type UserState = {
    isLoading: boolean
    user: UserDto
}