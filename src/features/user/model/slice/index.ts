import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editUserInformation } from "../actions/editUserInformation.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { editUserAvatar } from "../actions/editUserAvatar.ts";

export type UserState = {
    user: UserAccount | null
    loading: boolean
}

const initialState: UserState = { user: null, loading: true };

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<{ user: UserAccount | null }>) => {
            state.user = action.payload.user;
            state.loading = !action.payload.user;
        }
    },
    extraReducers: builder => {
        builder
        .addCase(editUserInformation.fulfilled, (state, action) => {
            state.user = action.payload;
        })
        .addCase(editUserInformation.rejected, () => {
            console.log("Edit User Information Error");
        })
        .addCase(editUserAvatar.fulfilled, (state, action) => {
            state.user = action.payload;
        })
        .addCase(editUserAvatar.rejected, () => {
            console.log("Edit User Information Error");
        });
    }
});

export const { updateUser } = userSlice.actions;
export const userReducer = userSlice.reducer;