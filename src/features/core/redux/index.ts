import { combineReducers } from "@reduxjs/toolkit";
import carsReducer from "../redux/cars/cars.slices";
import carsApiSlices from "../redux/cars/cars.api.slices";

const rootReducer = combineReducers({
    cars: carsReducer,
    [carsApiSlices.reducerPath]: carsApiSlices.reducer
});

export default rootReducer;