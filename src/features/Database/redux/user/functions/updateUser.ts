import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../connector/Database.ts";
import { getImageFromAttachmentQueue } from "../../../utils/getImageFromAttachmentQueue.ts";
import { UserState } from "../user.slices";

interface UpdateUserReturn {
    user: UserState["user"];
}

export interface UpdateUserArgs {
    database: Database
    newUser?: UserState["user"] | null
}

interface AsyncThunkConfig {
    rejectValue: { user: UserState["user"] }
}

export const updateUser =
    createAsyncThunk<UpdateUserReturn, UpdateUserArgs, AsyncThunkConfig>(
        "user/update",
        async (args, { rejectWithValue }) => {
            const {
                database: { attachmentQueue },
                newUser
            } = args;

            if(!newUser) return { user: null }

            try {
                const avatarImage = await getImageFromAttachmentQueue(attachmentQueue, newUser.avatarImage?.path)

                return { user: { ...newUser, avatarImage } };
            } catch (_) {
                return rejectWithValue({ user: { ...newUser, avatarImage: null } });
            }
        }
    )