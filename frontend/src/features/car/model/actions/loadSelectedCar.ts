import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../../../constants/index.ts";

export const loadSelectedCar = createAsyncThunk(
    "loadSelectedCarIndex",
    async (arg: { asd?: string } = {}, { rejectWithValue }) => {
        try {
            const id = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX);
            return id ? id : "";
        } catch(e) {
            console.log("loadSelectedCar", e);
            return rejectWithValue(0);
        }
    }
);