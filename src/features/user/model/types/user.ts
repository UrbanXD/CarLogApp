import { UserTableType } from "../../../../database/connector/powersync/AppSchema.ts";

export type ImageType = {
    path: string
    image: string
}

export type UserDto = Omit<UserTableType, "avatarImage"> & { userAvatar: ImageType | null }

export type UserState = {
    isLoading: boolean
    user: UserDto
}