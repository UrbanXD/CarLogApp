import { AsyncThunk, AsyncThunkPayloadCreator, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./index.ts";

type ThunkApiConfig = {
    state: RootState
}

export const createAsyncThunkWithTypes = <Returned, ThunkArg = any>(
    typePrefix: string,
    thunk: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>
): AsyncThunk<Returned, ThunkArg, ThunkApiConfig> => {
    return createAsyncThunk<Returned, ThunkArg, ThunkApiConfig>(
        typePrefix,
        async (arg, thunkApi) => {
            try {
                return await thunk(arg, thunkApi);
            } catch(err) {
                return thunkApi.rejectWithValue(null);
            }
        }
    );
};