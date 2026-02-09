import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../../../database/redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../../../constants";

export const loadSelectedCar = createAsyncThunk<
    string | null,
    undefined | void,
    { state: RootState }
>(
    "loadSelectedCar",
    async (_, { rejectWithValue }) => {
        try {
            return await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX);
        } catch(e) {
            console.log("Load selected car error: ", e);
            return rejectWithValue(null);
        }
    }
);