import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { ScreenScrollViewContext } from "./ScreenScrollViewContext.ts";

interface ScreenScrollViewProviderProps {
    children: React.ReactNode | null;
}

export const ScreenScrollViewProvider: React.FC<ScreenScrollViewProviderProps> = ({
    children
}) => {
    const y = useSharedValue(0);
    const distanceFromBottom = useSharedValue(0);
    const scrollDirection = useSharedValue<"up" | "down">("down");
    const isScrolling = useSharedValue(false);

    return (
        <ScreenScrollViewContext.Provider
            value={ { y, distanceFromBottom, scrollDirection, isScrolling } }
        >
            { children }
        </ScreenScrollViewContext.Provider>
    );
};
//TODO INPUT es Screen illetve features