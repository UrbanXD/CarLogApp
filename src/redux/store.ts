import rootReducer from "./reducers";

import { configureStore } from '@reduxjs/toolkit'
import footballAPIService from "../services/footballAPI.service"
import carsApiSlices from "./reducers/cars.api.slices";

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: footballAPIService
            }
        })
            // .prepend(listenerMiddleware.middleware)
            .concat(carsApiSlices.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;