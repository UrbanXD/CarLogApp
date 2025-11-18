import { Database } from "../../../../database/connector/Database.ts";
import { UserState } from "../slice";
import { createAsyncThunkWithTypes } from "../../../../database/redux/createAsyncThunkWithTypes.ts";
import { EditUserInformationRequest } from "../../schemas/form/editUserInformation.ts";
import { UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";

type EditUserReturn = { user: UserState["user"] }

type EditUserArgs = {
    database: Database
    request: EditUserInformationRequest
}

export const editUserInformation =
    createAsyncThunkWithTypes<EditUserReturn, EditUserArgs>(
        "user/edit/information",
        async (args, { getState }) => {
            const { user: { user: oldUser } } = getState();
            const { database: { userDao }, request } = args;

            if(!oldUser) return null;

            const user: UserTableRow = {
                id: oldUser.id,
                email: oldUser.email,
                firstname: request.firstname,
                lastname: request.lastname,
                currency_id: request.currency_id,
                avatar_url: oldUser.avatar?.path,
                avatar_color: oldUser.avatarColor
            };

            return await userDao.update(user);
        }
    );