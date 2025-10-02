import { CarsState } from "../types/index.ts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadCars } from "../actions/loadCars.ts";
import { createCar } from "../actions/createCar.ts";
import { editCar } from "../actions/editCar.ts";
import { deleteCar } from "../actions/deleteCar.ts";
import { selectCar } from "../actions/selectCar.ts";

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
        updateCarOdometer: (state, action: PayloadAction<{ carId: string, value: number }>) => {
            const carIndex = state.cars.findIndex(car => car.id === action.payload.carId);
            if(carIndex === -1) return;

            const updatedCar = state.cars[carIndex];
            updatedCar.odometer.value = action.payload.value;

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
        })
        .addCase(deleteCar.fulfilled, (state, action) => {
            state.cars = state.cars.filter((car) => car.id !== action.payload);
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

export const { updateCarOdometer } = carsSlice.actions;
export const carsReducer = carsSlice.reducer;