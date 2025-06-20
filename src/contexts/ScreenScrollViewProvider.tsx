import React, { Context, createContext, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

interface ScreenScrollViewProviderValue {
    offset: SharedValue<number>;
}

const ScreenScrollViewContext =
    createContext<ScreenScrollViewProviderValue | null>(null);

interface ScreenScrollViewProviderProps {
    children: React.ReactNode | null;
}

export const ScreenScrollViewProvider: React.FC<ScreenScrollViewProviderProps> = ({
    children
}) => {
    const offset = useSharedValue(0);

    return (
        <ScreenScrollViewContext.Provider
            value={ {
                offset
            } }
        >
            { children }
        </ScreenScrollViewContext.Provider>
    );
};

export const useScreenScrollView = () =>
    useContext<ScreenScrollViewProviderValue>(
        ScreenScrollViewContext as Context<ScreenScrollViewProviderValue>
    );
