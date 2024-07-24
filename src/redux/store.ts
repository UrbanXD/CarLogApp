import rootReducer from "./reducers";

import { configureStore } from '@reduxjs/toolkit'
import footballAPIService from "../services/footballAPI.service"

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: footballAPIService
            }
        })
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;