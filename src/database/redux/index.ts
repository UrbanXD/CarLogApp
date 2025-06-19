import { combineReducers } from "@reduxjs/toolkit";
import { CarsState, carsReducer } from "./car/cars.slices.ts";
import { UserState, userReducer } from "../../features/user/model/slice/index.ts";
import carsApiSlices from "./car/cars.api.slices.ts";
import { Reducer } from "react";

const rootReducer = combineReducers({
    cars: carsReducer as Reducer<CarsState>,
    user: userReducer as Reducer<UserState>,
    [carsApiSlices.reducerPath]: carsApiSlices.reducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;