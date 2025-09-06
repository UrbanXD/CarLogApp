import { createSlice } from "@reduxjs/toolkit";
import { loadUser } from "../actions/loadUser.ts";
import { editUserName } from "../actions/editUserName.ts";
import { User } from "../../schemas/userSchema.tsx";

type UserState = { user: User | null }

const initialState: UserState = { user: null };

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(loadUser.fulfilled, (state, action) => {
            state.user = action.payload;
        })
        .addCase(editUserName.fulfilled, (state, action) => {
            state.user = action.payload.user;
        }).addCase(editUserName.rejected, (state, action) => {
            console.log(state);
        });
    }
});

export const userReducer = userSlice.reducer;