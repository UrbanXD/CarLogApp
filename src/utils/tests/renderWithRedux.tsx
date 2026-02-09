import { RootState } from "../../database/redux";
import { configureStore } from "@reduxjs/toolkit";
import { alertReducer } from "../../ui/alert/model/slice";
import { carsReducer } from "../../features/car/model/slice";
import { render } from "@testing-library/react-native";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { MockContextConfig, renderRouter } from "expo-router/testing-library";

const setupStore = (preloadedState?: Partial<RootState>) => {
    const initialState: RootState = {
        alert: {
            toasts: [],
            modal: null
        },
        cars: {
            selectedCarId: null
        },
        ...preloadedState
    };

    return configureStore({
        reducer: {
            cars: carsReducer,
            alert: alertReducer
        },
        preloadedState: initialState,
        middleware:
            getDefaultMiddleware =>
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
};

export type MockInitialReduxState = Partial<RootState>;

export const renderWithRedux = (component: ReactNode, initialState?: MockInitialReduxState) => {
    const store = setupStore(initialState);

    return {
        ...render(<Provider store={ store }>{ component }</Provider>),
        store
    };
};

export const renderRouterWithRedux = (
    config: MockContextConfig,
    initialUrl: string
) => {
    const store = setupStore();

    return {
        ...renderRouter(
            config,
            { initialUrl, wrapper: ({ children }) => <Provider store={ store }>{ children }</Provider> }
        ),
        store
    };
};