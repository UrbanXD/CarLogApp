import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../connector/Database.ts";
import { UserTableType } from "../../../connector/powersync/AppSchema.ts";
import { getImageFromAttachmentQueue } from "../../../utils/getImageFromAttachmentQueue.ts";
import { ImageType } from "../user.slices.ts";

interface LoadUserReturn {
    user: UserTableType | null
    userAvatar: ImageType | null
}

interface LoadUserArgs {
    database: Database
    userId: string
    defaultUserValue: UserTableType
}

interface AsyncThunkConfig {
    rejectValue: LoadUserReturn
}

export const loadUser =
    createAsyncThunk<LoadUserReturn, LoadUserArgs, AsyncThunkConfig>(
        "user/load",
        async (args, { rejectWithValue }) => {
            const {
                database: { userDAO, attachmentQueue },
                userId,
                defaultUserValue
            } = args;

            try {
                const user = await userDAO.getUser(userId);
                const userAvatar = await getImageFromAttachmentQueue(attachmentQueue, user.avatarImage);

                return { user, userAvatar };
            } catch (_) {
                const userAvatar = await getImageFromAttachmentQueue(attachmentQueue, defaultUserValue.avatarImage);
                return rejectWithValue({ user: defaultUserValue, userAvatar });
            }
        }
    )