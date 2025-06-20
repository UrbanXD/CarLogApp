import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import { ImageType, UserState } from "../../../../database/redux/user/user.slices.ts";
import { UserTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { RootState } from "../../../../database/redux/index.ts";

interface UpdateUserReturn {
    user: UserState["user"] | null;
    userAvatar: UserState["userAvatar"] | null;
}

export interface UpdateUserArgs {
    database: Database;
    newUser: UserTableType | null;
    newAvatar: ImageType | null;
}

interface AsyncThunkConfig {
    state: RootState;
}

export const updateUser =
    createAsyncThunk<UpdateUserReturn, UpdateUserArgs, AsyncThunkConfig>(
        "user/update",
        async (args, { getState }) => {
            const {
                user: { user: oldUser, userAvatar: oldAvatar }
            } = getState();
            const {
                newUser,
                newAvatar
            } = args;

            if(!newUser) return { user: oldUser, userAvatar: oldAvatar };

            let newUserAvatar = oldAvatar || null;
            if(oldAvatar.path !== newAvatar.path) {
                newUserAvatar = newAvatar;
            }

            return { user: newUser, userAvatar: newUserAvatar };
        }
    );