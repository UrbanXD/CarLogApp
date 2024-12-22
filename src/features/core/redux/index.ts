import { combineReducers } from "@reduxjs/toolkit";
import carsReducer from "../redux/cars/cars.slices";

const rootReducer = combineReducers({
    cars: carsReducer,
});

export default rootReducer;