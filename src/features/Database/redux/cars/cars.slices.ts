import { createSlice } from "@reduxjs/toolkit";
import { CarTableType } from "../../connector/powersync/AppSchema";
import { loadCars } from "./functions/loadCars";
import { addCar } from "./functions/addCar";
import { loadSelectedCar } from "./functions/loadSelectedCar";
import { selectCar } from "./functions/selectCar";
import { deleteCar } from "./functions/deleteCar";
import {editCar} from "./functions/editCar";
import car from "../../../../app/(edit)/car";

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
            .addCase(addCar.rejected, () => {
                console.log("hiba addCar, Slices")
            })
            .addCase(editCar.fulfilled, (state, action) => {
                const index = state.cars.findIndex(car => car.id === action.payload.id);
                if (index !== -1) {
                    state.cars[index] = action.payload;
                }
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                state.cars = state.cars.filter((car) => car.id !== action.payload.id);
            })
            .addCase(deleteCar.rejected, () => {
                console.log("hiba, delete car, slices")
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