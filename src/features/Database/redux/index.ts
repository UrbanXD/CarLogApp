import { combineReducers } from "@reduxjs/toolkit";
import carsReducer from "./cars/cars.slices";
import userReducer from "./user/user.slices";
import carsApiSlices from "./cars/cars.api.slices";

const rootReducer = combineReducers({
    cars: carsReducer,
    user: userReducer,
    [carsApiSlices.reducerPath]: carsApiSlices.reducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>