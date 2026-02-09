import { CarsState } from "../types/index.ts";
import { createSlice } from "@reduxjs/toolkit";
import { selectCar } from "../actions/selectCar.ts";
import { loadSelectedCar } from "../actions/loadSelectedCar.ts";

const initialState: CarsState = {
    selectedCarId: null
};

const carsSlice = createSlice({
    name: "selectedCar",
    initialState,
    reducers: {
        resetSelectedCar: (state: CarsState) => {
            state.selectedCarId = null;
        }
    },
    extraReducers: builder => {
        builder
        .addCase(selectCar.fulfilled, (state, action) => {
            state.selectedCarId = action.payload;
        })
        .addCase(selectCar.rejected, () => {
            console.log("Car slice select car rejected");
        })
        .addCase(loadSelectedCar.fulfilled, (state, action) => {
            state.selectedCarId = action.payload;
        })
        .addCase(loadSelectedCar.rejected, () => {
            console.log("Car slice select car rejected");
        });
    }
});

export const { resetSelectedCar } = carsSlice.actions;
export const carsReducer = carsSlice.reducer;