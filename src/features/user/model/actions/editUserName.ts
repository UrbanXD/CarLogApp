import { Database } from "../../../../database/connector/Database.ts";
import { UserState } from "../slice";
import { createAsyncThunkWithTypes } from "../../../../database/redux/createAsyncThunkWithTypes.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { EditUserNameRequest } from "../../schemas/form/editUserNameRequest.ts";

type EditUserReturn = { user: UserState["user"] }

type EditUserArgs = {
    database: Database
    request: EditUserNameRequest
}

export const editUserName =
    createAsyncThunkWithTypes<EditUserReturn, EditUserArgs>(
        "user/edit/name",
        async (args, { getState }) => {
            const { user: { user: oldUser } } = getState();
            const { database: { userDao }, request } = args;

            const user: UserAccount = {
                ...oldUser,
                firstname: request.firstname,
                lastname: request.lastname
            };

            return await userDao.editUser(user);
        }
    );