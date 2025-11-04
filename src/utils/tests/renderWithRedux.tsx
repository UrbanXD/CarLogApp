import { RootState } from "../../database/redux/index.ts";
import { configureStore } from "@reduxjs/toolkit";
import { alertReducer } from "../../ui/alert/model/slice/index.ts";
import { carsReducer } from "../../features/car/model/slice/index.ts";
import { userReducer } from "../../features/user/model/slice/index.ts";
import { render } from "@testing-library/react-native";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { MockContextConfig, renderRouter } from "expo-router/testing-library";
import { carLogReducer } from "../../features/carLog/model/slice/index.ts";

const setupStore = (preloadedState?: Partial<RootState>) =>
    configureStore({
        reducer: {
            user: userReducer,
            cars: carsReducer,
            alert: alertReducer,
            carLog: carLogReducer
        },
        preloadedState,
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