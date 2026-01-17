import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../../../constants/index.ts";
import { RootState } from "../../../../database/redux/index.ts";
import { Car } from "../../schemas/carSchema.ts";

export const selectCar = createAsyncThunk<
    Car | null,
    string | undefined | void,
    { state: RootState }
>(
    "selectCar",
    async (carId, { getState, rejectWithValue }) => {
        const state = getState() as RootState;

        try {
            const selectedCarId = carId ?? await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX);
            let selectedCar =
                state.cars.cars.find(car => car.id === selectedCarId) ??
                state.cars.cars.find(car => car.id === state.cars.selectedCar?.id) ??
                null;

            if(selectedCar) await AsyncStorage.setItem(BaseConfig.LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX, selectedCar.id);
            return selectedCar;
        } catch(e) {
            console.log(e);
            return rejectWithValue(null);
        }
    }
);