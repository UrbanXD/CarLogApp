import { Database } from "../../../../database/connector/Database.ts";
import { UserState } from "../types/user.ts";
import { Image } from "../../../../types/index.ts";
import { createAsyncThunkWithTypes } from "../../../../database/redux/createAsyncThunkWithTypes.ts";
import { EditUserRequest } from "../../schemas/editUserRequestSchema.ts";
import { User } from "../../schemas/userSchema.tsx";

type EditUserReturn = {
    user: UserState["user"] | null
}

type EditUserArgs = {
    database: Database
    newUser: EditUserRequest | null
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

            const user: User = {
                ...oldUser,
                ...newUser,
                userAvatar: newUserAvatar
            };

            return { user: await userDAO.editUser(user) };
        }
    );