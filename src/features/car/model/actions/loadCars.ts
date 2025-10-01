import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../../../constants/index.ts";

export const loadCars = createAsyncThunk(
    "cars",
    async (database: Database, { rejectWithValue }) => {
        try {
            const cars = await database.carDao.getAll();

            const id = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX);
            const selectedCar = id ? await database.carDao.getById(id, false) : null;

            return { cars, selectedCar: selectedCar };
        } catch(e) {
            console.log("loadCars", e);
            return rejectWithValue("");
        }
    }
);