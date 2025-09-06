import { Database } from "../../../../database/connector/Database.ts";
import { UserState } from "../types/user.ts";
import { createAsyncThunkWithTypes } from "../../../../database/redux/createAsyncThunkWithTypes.ts";
import { User } from "../../schemas/userSchema.tsx";
import { EditUserNameRequest } from "../../schemas/editNameRequest.ts";

type EditUserReturn = { user: UserState["user"] }

type EditUserArgs = {
    database: Database
    request: EditUserNameRequest
}

export const editUserAvatar =
    createAsyncThunkWithTypes<EditUserReturn, EditUserArgs>(
        "user/edit/name",
        async (args, { getState }) => {
            const { user: { user: oldUser } } = getState();
            const { database: { userDAO }, request } = args;

            const user: User = {
                ...oldUser,
                firstname: request.firstname,
                lastname: request.lastname
            };

            return { user: await userDAO.editUser(user) };
        }
    );