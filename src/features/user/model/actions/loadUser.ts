import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import { UserTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { toUserDto } from "../mapper/index.ts";
import { UserDto } from "../types/user.ts";

interface LoadUserArgs {
    database: Database;
    userId: string;
    defaultUserValue?: UserTableType;
}

interface AsyncThunkConfig {
    rejectValue: UserDto;
}

export const loadUser =
    createAsyncThunk<UserDto, LoadUserArgs, AsyncThunkConfig>(
        "user/load",
        async (args, { rejectWithValue }) => {
            const {
                database: { userDAO, attachmentQueue },
                userId,
                defaultUserValue
            } = args;

            try {
                const user: UserTableType = await userDAO.getUser(userId);

                return await toUserDto(user, attachmentQueue);
            } catch(_) {
                return rejectWithValue(await toUserDto(defaultUserValue, attachmentQueue));
            }
        }
    );