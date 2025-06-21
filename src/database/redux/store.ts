import rootReducer from "./index";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: [
                    "alert.modal.acceptAction",
                    "alert.modal.dismissAction"
                ],
                ignoredActionPaths: [
                    "meta.arg",
                    "payload.acceptAction",
                    "payload.dismissAction"
                ]
            }
        })
});