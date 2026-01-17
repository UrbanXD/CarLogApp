import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAccount } from "../../schemas/userSchema.ts";

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
    }
});

export const { updateUser } = userSlice.actions;
export const userReducer = userSlice.reducer;