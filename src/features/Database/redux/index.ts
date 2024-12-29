import { combineReducers } from "@reduxjs/toolkit";
import carsReducer from "./cars/cars.slices";
import carsApiSlices from "./cars/cars.api.slices";

const rootReducer = combineReducers({
    cars: carsReducer,
    [carsApiSlices.reducerPath]: carsApiSlices.reducer
});

export default rootReducer;