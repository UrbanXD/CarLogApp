import rootReducer from "./index";
import { configureStore } from '@reduxjs/toolkit'
import carsApiSlices from "./cars/cars.api.slices";

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ })
            .concat(carsApiSlices.middleware)
});

export type AppDispatch = typeof store.dispatch;