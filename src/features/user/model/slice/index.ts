import { createSlice } from "@reduxjs/toolkit";
import { loadUser } from "../actions/loadUser.ts";
import { editUserInformation } from "../actions/editUserInformation.ts";
import { UserAccount } from "../../schemas/userSchema.ts";

export type UserState = {
    user: UserAccount | null
    loading: boolean
}

const initialState: UserState = { user: null };

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUser: (state) => {
            state.user = null;
            state.loading = false;
        }
    },
    extraReducers: builder => {
        builder
        .addCase(loadUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
        })
        .addCase(loadUser.rejected, (state) => {
            state.loading = false;
            state.user = null;
        })
        .addCase(editUserInformation.fulfilled, (state, action) => {
            state.user = action.payload;
        })
        .addCase(editUserInformation.rejected, (state, action) => {
            console.log("Edit User Information Error");
        });
    }
});

export const { resetUser } = userSlice.actions;
export const userReducer = userSlice.reducer;