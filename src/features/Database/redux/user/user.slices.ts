import { UserTableType } from "../../connector/powersync/AppSchema.ts";
import { createSlice } from "@reduxjs/toolkit";
import { loadUser } from "./functions/loadUser.ts";

export type UserType = Omit<UserTableType, "avatarImage"> & {
    avatarImage?: { path: string, image: string } | null
}

export interface UserState {
    isLoading: boolean
    user: UserType | null
}

const initialState: UserState = {
    isLoading: true,
    user: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadUser.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
            })
    },
})

export default userSlice.reducer;