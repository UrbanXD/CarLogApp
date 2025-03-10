import { combineReducers } from "@reduxjs/toolkit";
import carsReducer from "./cars/cars.slices.ts";
import userReducer from "./user/user.slices.ts";
import carsApiSlices from "./cars/cars.api.slices.ts";

const rootReducer = combineReducers({
    cars: carsReducer,
    user: userReducer,
    [carsApiSlices.reducerPath]: carsApiSlices.reducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>