import { UserTableType } from "../../connector/powersync/AppSchema.ts";
import { createSlice } from "@reduxjs/toolkit";
import { loadUser } from "./actions/loadUser.ts";
import { updateUser } from "./actions/updateUser.ts";

export type ImageType = {
    path: string
    image: string
}

export interface UserState {
    isLoading: boolean
    user: UserTableType | null
    userAvatar: ImageType | null
}

const initialState: UserState = {
    isLoading: true,
    user: null,
    userAvatar: null
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
            .addCase(loadUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = action.payload?.user ?? null;
                state.userAvatar = action.payload?.userAvatar ?? null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.userAvatar = action.payload.userAvatar;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.userAvatar = action.payload.userAvatar;
            })
    },
})

export const userReducer = userSlice.reducer;