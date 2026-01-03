import { CarsState } from "../types/index.ts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
        updateCars: (
            state,
            action: PayloadAction<{ cars: Array<Car>, shouldReplace?: boolean }>
        ) => {
            const { cars, shouldReplace = false } = action.payload;

            if(shouldReplace) {
                state.cars = cars;
                return;
            }

            cars.forEach(updatedCar => {
                const index = state.cars.findIndex(car => car.id === updatedCar.id);
                if(index !== -1) {
                    state.cars[index] = updatedCar;
                } else {
                    state.cars.push(updatedCar);
                    state.cars.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                }
            });

            state.loading = false;
        },
        deleteCars: (state, action: PayloadAction<{ carIds: Array<string> }>) => {
            const { carIds } = action.payload;
            state.cars = state.cars.filter(car => !carIds.includes(car.id));
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
        .addCase(selectCar.fulfilled, (state, action) => {
            state.selectedCar = action.payload;
        })
        .addCase(selectCar.rejected, () => {
            console.log("Car slice select car rejected");
        });
    }
});

export const { updateCars, deleteCars, updateCarOdometer } = carsSlice.actions;
export const carsReducer = carsSlice.reducer;