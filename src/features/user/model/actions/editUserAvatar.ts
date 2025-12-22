import { Database } from "../../../../database/connector/Database.ts";
import { UserState } from "../slice";
import { createAsyncThunkWithTypes } from "../../../../database/redux/createAsyncThunkWithTypes.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { EditUserAvatarRequest } from "../../schemas/form/editUserAvatarRequest.ts";

type EditUserReturn = { user: UserState["user"] }

type EditUserArgs = {
    database: Database
    request: EditUserAvatarRequest
}

export const editUserAvatar =
    createAsyncThunkWithTypes<EditUserReturn, EditUserArgs>(
        "user/edit/avatar",
        async (args, { getState, rejectWithValue }) => {
            const { user: { user: oldUser } } = getState();
            const { database: { userDao, attachmentQueue }, request } = args;

            if(!oldUser) return rejectWithValue();

            let avatar = request?.avatar ?? null;
            let path = null;

            if(request.isImageAvatar && attachmentQueue && avatar && oldUser?.avatar?.fileName !== avatar.fileName) {
                const newAvatar = await attachmentQueue.saveFile(avatar, oldUser.id);
                path = newAvatar.filename;
            }

            const user: UserAccount = {
                ...oldUser,
                avatar: (request.isImageAvatar && avatar && path) ? { ...avatar, fileName: path } : null,
                avatarColor: !request.isImageAvatar ? request.avatarColor : oldUser.avatarColor
            };

            return await userDao.update(user);
        }
    );