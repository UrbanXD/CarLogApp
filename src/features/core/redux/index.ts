import { combineReducers } from "@reduxjs/toolkit";
import carsReducer from "../../form/redux/cars/cars.slices";
import carsApiSlices from "../../form/redux/cars/cars.api.slices";

const rootReducer = combineReducers({
    cars: carsReducer,
    [carsApiSlices.reducerPath]: carsApiSlices.reducer
});

export default rootReducer;