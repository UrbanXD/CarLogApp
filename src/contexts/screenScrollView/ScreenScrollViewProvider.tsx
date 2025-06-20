import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { ScreenScrollViewContext } from "./ScreenScrollViewContext.ts";

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