import { combineReducers } from "@reduxjs/toolkit";
import { carsReducer } from "../../features/car/model/slice";
import { alertReducer } from "../../ui/alert/model/slice";

const rootReducer = combineReducers({
    cars: carsReducer,
    alert: alertReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;