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
        async (args, { getState }) => {
            const { user: { user: oldUser } } = getState();
            const { database: { userDAO, attachmentQueue }, request } = args;

            //TODO fixalni hogy maga a request ImageType legyen hogy itt tudjam lementeni

            // let avatar = request?.avatar ?? null;

            //     if(avatar && oldUser?.avatar?.path !== avatar.path) {
            //         await attachmentQueue?.saveFile()
            //     }
            // }

            // if(newUser?.avatarImage && user?.userAvatar?.path !== getPathFromImageType(newUser.avatarImage, user?.id)) {
            //     const newAvatarImage = await attachmentQueue.saveFile(newUser.avatarImage, user.id);
            //     newUserAvatar = getImageState(newAvatarImage.filename, newUser.avatarImage.buffer);
            // }

            const user: UserAccount = {
                ...oldUser,
                avatar: request.avatar,
                avatarColor: request.avatarColor
            };

            return await userDAO.editUser(user);
        }
    );