import { CarsState } from "../types/index.ts";
import { createSlice } from "@reduxjs/toolkit";
import { loadCars } from "../actions/loadCars.ts";
import { addCar } from "../actions/addCar.ts";
import { editCar } from "../actions/editCar.ts";
import { deleteCar } from "../actions/deleteCar.ts";
import { loadSelectedCar } from "../actions/loadSelectedCar.ts";
import { selectCar } from "../actions/selectCar.ts";

const initialState: CarsState = {
    loading: true,
    loadError: false,
    cars: [],
    selectedCarId: ""
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
                if(!action.payload) return;
                state.cars.push(action.payload);
            })
            .addCase(addCar.rejected, () => {
                console.log("hiba addCar, Slices")
            })
            .addCase(editCar.fulfilled, (state, action) => {
                const editedCar = action.payload;

                const index = state.cars.findIndex(car => car.id === editedCar.id);
                if(index === -1) return;
                state.cars[index] = editedCar;
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

export const carsReducer = carsSlice.reducer;