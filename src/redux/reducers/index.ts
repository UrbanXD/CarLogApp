import {combineReducers} from "@reduxjs/toolkit";
import carsReducer from "./cars.slices";

const rootReducer = combineReducers({
    cars: carsReducer,
});

export default rootReducer;