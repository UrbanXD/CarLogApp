import { UserTableType } from "../../connector/powersync/AppSchema.ts";
import { createSlice } from "@reduxjs/toolkit";
import { loadUser } from "./functions/loadUser.ts";

export type UserType = UserTableType & {
    avatarImage: { path: string, image: string }
}

export interface UserState {
    loading: boolean
    user: UserType | null
}

const initialState: UserState = {
    loading: true,
    user: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = {
                    ...action.payload.user,
                    avatarImage: {
                        path: action.payload.user.avatarImage,
                        image: action.payload.avatarImage
                    }
                } as UserType;
            })
    },
})

export default userSlice.reducer;