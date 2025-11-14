import { CarsState } from "../types/index.ts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadCars } from "../actions/loadCars.ts";
import { createCar } from "../actions/createCar.ts";
import { editCar } from "../actions/editCar.ts";
import { deleteCar } from "../actions/deleteCar.ts";
import { selectCar } from "../actions/selectCar.ts";
import { Car } from "../../schemas/carSchema.ts";
import { Odometer } from "../../_features/odometer/schemas/odometerSchema.ts";

const initialState: CarsState = {
    loading: true,
    loadError: false,
    cars: [],
    selectedCar: null
};

const carsSlice = createSlice({
    name: "cars",
    initialState,
    reducers: {
        resetCars: (state) => {
            state.cars = [];
            state.loading = true;
            state.loadError = false;
            state.selectedCar = null;
        },
        updateCarOdometer: (state, action: PayloadAction<{ odometer: Odometer }>) => {
            const carIndex = state.cars.findIndex(car => car.id === action.payload.odometer.carId);
            if(carIndex === -1) return;

            const updatedCar: Car = state.cars[carIndex];
            updatedCar.odometer = action.payload?.odometer;

            state.cars[carIndex] = updatedCar;
        }
    },
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
            state.cars = action.payload.cars;
            state.selectedCar = action.payload.selectedCar;
        })
        .addCase(createCar.fulfilled, (state, action) => {
            if(!action.payload) return;
            state.cars.push(action.payload);
        })
        .addCase(createCar.rejected, () => {
            console.log("hiba addCar, Slices");
        })
        .addCase(editCar.fulfilled, (state, action) => {
            if(!action.payload) return;

            const editedCar = action.payload;

            const index = state.cars.findIndex(car => car.id === editedCar.id);
            if(index === -1) return;

            state.cars[index] = editedCar;
            if(state.selectedCar.id === editedCar?.id) state.selectedCar = editedCar;
        })
        .addCase(deleteCar.fulfilled, (state, action) => {
            state.cars = state.cars.filter((car) => car.id !== action.payload);
            if(action.payload && state.selectedCar?.id === action.payload) state.selectedCar = null;
        })
        .addCase(deleteCar.rejected, () => {
            console.log("hiba, delete car, slices");
        })
        .addCase(selectCar.fulfilled, (state, action) => {
            state.selectedCar = action.payload;
        })
        .addCase(selectCar.rejected, () => {
            console.log("nijncs kivalasztva HIBA");
        });
    }
});

export const { updateCarOdometer, resetCars } = carsSlice.actions;
export const carsReducer = carsSlice.reducer;