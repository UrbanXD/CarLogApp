import {UserState} from "../types/user.ts";
import {createSlice} from "@reduxjs/toolkit";
import {loadUser} from "../actions/loadUser.ts";
import {updateUser} from "../actions/updateUser.ts";

const initialState: UserState = {
    isLoading: false,
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
           .addCase(loadUser.rejected, (state, action) => {
               state.isLoading = false;
               state.user = action.payload?.user ?? null;
           })
           .addCase(loadUser.fulfilled, (state, action) => {
               state.isLoading = false;
               state.user = action.payload.user;
           })
           .addCase(updateUser.fulfilled, (state, action) => {
               state.user = action.payload.user;
           })
   }
});

export const userReducer = userSlice.reducer;