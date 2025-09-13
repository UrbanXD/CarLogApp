import { createSlice } from "@reduxjs/toolkit";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { createOdometerLog } from "../actions/createOdometerLog.ts";

type LogState = {
    odometerLogLoading: boolean
    odometerLog: Array<OdometerLog>
    // fuelLogLoading: boolean
    // fuelLog: Array<FuelLog>
}

const initialState: LogState = {
    odometerLogLoading: true,
    odometerLog: []
    // fuelLogLoading: true,
    // fuelLog: []
};

const carLogSlice = createSlice({
    name: "logs",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(createOdometerLog.fulfilled, (state, action) => {
            if(!action.payload) return;
            console.log("sikeres gyartas: log", action.payload);
            state.odometerLog.push(action.payload);
        })
        .addCase(createOdometerLog.rejected, () => {
            console.log("hiba creatte odometer log, Slices");
        });
    }
});

export const carLogReducer = carLogSlice.reducer;