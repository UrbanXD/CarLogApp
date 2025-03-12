import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../connector/Database.ts";
import { getImageFromAttachmentQueue } from "../../../utils/getImageFromAttachmentQueue.ts";
import { UserState } from "../user.slices";
import { UserTableType } from "../../../connector/powersync/AppSchema.ts";
import { RootState } from "../../index.ts";

interface UpdateUserReturn {
    user: UserState["user"] | null;
    userAvatar: UserState["userAvatar"] | null;
}

export interface UpdateUserArgs {
    database: Database
    newUser: UserTableType | null
}

interface AsyncThunkConfig {
    state: RootState
}

export const updateUser =
    createAsyncThunk<UpdateUserReturn, UpdateUserArgs, AsyncThunkConfig>(
        "user/update",
        async (args, { getState }) => {
            const {
                user: { user }
            } = getState();
            const {
                database: { attachmentQueue },
                newUser
            } = args;

            if(!newUser) return { user: null, userAvatar: null };

            let newUserAvatar = null;
            if(user?.avatarImage !== newUser.avatarImage) {
                newUserAvatar = await getImageFromAttachmentQueue(attachmentQueue, newUser.avatarImage);
            }

            console.log(user, newUser);

            return { user: newUser, userAvatar: newUserAvatar };
        }
    )