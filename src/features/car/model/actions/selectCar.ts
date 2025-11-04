import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../../../constants/index.ts";
import { Database } from "../../../../database/connector/Database.ts";

type SelectCarArgs = {
    database: Database
    carId: string
}

export const selectCar = createAsyncThunk(
    "selectCar",
    async (args: SelectCarArgs, { rejectWithValue }) => {
        const { database: { carDao }, carId } = args;

        try {
            await AsyncStorage.setItem(BaseConfig.LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX, carId);
            return await carDao.getById(carId);
        } catch(e) {
            console.log(e);
            return rejectWithValue(null);
        }
    }
);