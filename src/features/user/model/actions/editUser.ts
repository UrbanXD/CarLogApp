import { Database } from "../../../../database/connector/Database.ts";
import { UserDto, UserState } from "../types/user.ts";
import { Image } from "../../../../types/index.ts";
import { EditUserFormFieldType } from "../../schemas/userSchema.tsx";
import { toUserDto, toUserEntity } from "../mapper/index.ts";
import { createAsyncThunkWithTypes } from "../../../../database/redux/createAsyncThunkWithTypes.ts";

type EditUserReturn = {
    user: UserState["user"] | null
}

type EditUserArgs = {
    database: Database
    newUser: EditUserFormFieldType | null
    newAvatar: Image | null
}

export const editUser =
    createAsyncThunkWithTypes<EditUserReturn, EditUserArgs>(
        "user/edit",
        async (args, { getState }) => {
            const { user: { user: oldUser } } = getState();
            const { database: { userDAO }, newUser, newAvatar } = args;

            if(!newUser) return { user: oldUser };

            let newUserAvatar: Image | null = oldUser.userAvatar;
            if(oldUser.userAvatar?.path !== newAvatar?.path) newUserAvatar = {
                path: newAvatar?.path,
                image: newAvatar?.image
            };

            const userDto: UserDto = {
                ...oldUser,
                ...newUser,
                userAvatar: newUserAvatar
            };

            const user = toUserEntity(userDto);
            const returned = await userDAO.editUser(user);

            return { user: await toUserDto(returned) };
        }
    );