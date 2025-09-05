import { Database } from "../../../../database/connector/Database.ts";
import { createAsyncThunkWithTypes } from "../../../../database/redux/createAsyncThunkWithTypes.ts";
import { User } from "../../schemas/userSchema.tsx";

type LoadUserArgs = {
    database: Database
    userId: string
}

export const loadUser =
    createAsyncThunkWithTypes<User, LoadUserArgs>(
        "user/load",
        async (args, { rejectWithValue }) => {
            const {
                database: { userDAO, attachmentQueue },
                userId
            } = args;

            try {
                return await userDAO.getUser(userId);
            } catch(_) {
                return rejectWithValue();
            }
        }
    );