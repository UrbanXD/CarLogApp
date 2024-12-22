import { createSlice } from "@reduxjs/toolkit";
import { CarTableType } from "../../utils/database/powersync/AppSchema";
import { loadCars } from "./functions/loadCars";
import {addCar} from "./functions/addCar";
import {loadSelectedCar} from "./functions/loadSelectedCar";
import {selectCar} from "./functions/selectCar";

interface CarsState {
    loading: boolean
    cars: Array<CarTableType>
    carsID: Array<string>
    selectedCarID: string
    loadError: boolean
}

const initialState: CarsState = {
    loading: true,
    cars: [],
    carsID: [],
    selectedCarID: "",
    loadError: false
}

const carsSlice = createSlice({
    name: "cars",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadCars.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadCars.rejected, (state) => {
                state.loading = false;
                state.loadError = true;
            })
            .addCase(loadCars.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = action.payload;
            })
            .addCase(addCar.fulfilled, (state, action) => {
                state.cars = [
                    ...state.cars,
                    action.payload
                ];
            })
            .addCase(loadSelectedCar.fulfilled, (state, action) => {
                state.selectedCarID = action.payload;
            })
            .addCase(loadSelectedCar.rejected, state => {
                console.log("roosz load car")
                state.selectedCarID = "";
            })
            .addCase(selectCar.fulfilled, (state, action) => {
                state.selectedCarID = action.payload;
            })
            .addCase(selectCar.rejected, () => {
                console.log("nijncs kivalasztva HIBA")
            })
    }
});

export default carsSlice.reducer;