import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../../../constants/BaseConfig.ts";

export const selectCar = createAsyncThunk(
    "selectCar",
    async (id: string, { rejectWithValue })=> {
        try {
            await AsyncStorage.setItem(BaseConfig.LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX, id.toString());
            return id;
        } catch (e) {
            console.log(e);
            return rejectWithValue(-1);
        }
    }
)