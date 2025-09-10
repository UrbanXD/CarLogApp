import { Database } from "../../../../database/connector/Database.ts";
import { createAsyncThunkWithTypes } from "../../../../database/redux/createAsyncThunkWithTypes.ts";
import { UserAccount } from "../../schemas/userSchema.ts";

type LoadUserArgs = {
    database: Database
    userId: string | null
}

export const loadUser =
    createAsyncThunkWithTypes<UserAccount, LoadUserArgs>(
        "user/load",
        async (args, { rejectWithValue }) => {
            const { database: { userDao }, userId } = args;

            if(!userId) return null;

            try {
                return await userDao.getUser(userId);
            } catch(error) {
                console.log("Load user error: ", error);
                return rejectWithValue();
            }
        }
    );