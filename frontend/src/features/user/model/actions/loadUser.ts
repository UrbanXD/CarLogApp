import { Database } from "../../../../database/connector/Database.ts";
import { UserTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { toUserDto } from "../mapper/index.ts";
import { UserDto } from "../types/user.ts";
import { createAsyncThunkWithTypes } from "../../../../database/redux/createAsyncThunkWithTypes.ts";

interface LoadUserArgs {
    database: Database;
    userId: string;
    defaultUserValue?: UserTableType;
}

interface AsyncThunkConfig {
    rejectValue: UserDto;
}

export const loadUser =
    createAsyncThunkWithTypes<UserDto, LoadUserArgs, AsyncThunkConfig>(
        "user/load",
        async (args, { rejectWithValue }) => {
            const {
                database: { userDAO, attachmentQueue },
                userId,
                defaultUserValue
            } = args;

            try {
                const user = await userDAO.getUser(userId);

                return await toUserDto(user, attachmentQueue);
            } catch(_) {
                return rejectWithValue(await toUserDto(defaultUserValue, attachmentQueue));
            }
        }
    );