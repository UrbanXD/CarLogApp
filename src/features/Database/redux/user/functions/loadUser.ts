import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../connector/Database.ts";
import { UserTableType } from "../../../connector/powersync/AppSchema.ts";
import { getImageFromAttachmentQueue } from "../../../utils/getImageFromAttachmentQueue.ts";
import { UserType } from "../user.slices";

interface LoadUserReturn {
    user: UserType
}

interface LoadUserArgs {
    database: Database
    userId: string
    defaultUserValue: UserTableType
}

interface AsyncThunkConfig {
    rejectValue: { user: UserType }
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
                const avatarImage = await getImageFromAttachmentQueue(attachmentQueue, user.avatarImage)

                return { user: { ...user, avatarImage } };
            } catch (_) {
                const avatarImage = await getImageFromAttachmentQueue(attachmentQueue, defaultUserValue.avatarImage)
                return rejectWithValue({ user: { ...defaultUserValue, avatarImage } });
            }
        }
    )