import { combineReducers } from "@reduxjs/toolkit";
import { carsReducer, CarsState } from "../../features/car/model/slice/index.ts";
import { userReducer, UserState } from "../../features/user/model/slice/index.ts";
import { Reducer } from "react";
import { alertReducer } from "../../ui/alert/model/slice/index.ts";
import { AlertState } from "../../ui/alert/model/types/index.ts";

const rootReducer = combineReducers({
    cars: carsReducer as Reducer<CarsState>,
    user: userReducer as Reducer<UserState>,
    alert: alertReducer as Reducer<AlertState>
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;