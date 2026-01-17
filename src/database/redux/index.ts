import { combineReducers } from "@reduxjs/toolkit";
import { carsReducer } from "../../features/car/model/slice/index.ts";
import { userReducer } from "../../features/user/model/slice/index.ts";
import { alertReducer } from "../../ui/alert/model/slice/index.ts";

const rootReducer = combineReducers({
    cars: carsReducer,
    user: userReducer,
    alert: alertReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;