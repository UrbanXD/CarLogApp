import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../../../constants";
import { RootState } from "../../../../database/redux";

export const selectCar = createAsyncThunk<
    string | null,
    string | undefined | void,
    { state: RootState }
>(
    "selectCar",
    async (carId, { rejectWithValue }) => {
        try {
            if(carId) await AsyncStorage.setItem(BaseConfig.LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX, carId);
            return carId ?? null;
        } catch(e) {
            console.log(e);
            return rejectWithValue(null);
        }
    }
);