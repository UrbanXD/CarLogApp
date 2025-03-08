import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../connector/Database.ts";
import { UserDAO } from "../../../DAOs/UserDAO.ts";
import { encode } from "base64-arraybuffer";
import { UserTableType } from "../../../connector/powersync/AppSchema.ts";

interface LoadUserReturn {
    user: UserTableType,
    avatarImage: string
}

interface LoadUserArgs {
    database: Database
    userId: string
}

export const loadUser =
    createAsyncThunk<LoadUserReturn, LoadUserArgs>(
    "user/load",
    async (args, { rejectWithValue })=> {
        const {
            database: {
                db,
                attachmentQueue
            },
            userId
        } = args;

        try {
            const userDAO = new UserDAO(db);
            const user = await userDAO.getUser(userId);

            let avatarImage = undefined;
            if(user.avatarImage && attachmentQueue) {
                const file = await attachmentQueue.getFile(user.avatarImage);
                if(file) avatarImage = encode(file);
            }

            return { user, avatarImage }
        } catch (e) {
            return rejectWithValue("");
        }
    }
)