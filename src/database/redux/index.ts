import { combineReducers } from "@reduxjs/toolkit";
import { CarsState, carsReducer } from "../../features/car/model/slice/index.ts";
import { UserState, userReducer } from "../../features/user/model/slice/index.ts";
import { Reducer } from "react";

const rootReducer = combineReducers({
    cars: carsReducer as Reducer<CarsState>,
    user: userReducer as Reducer<UserState>,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;