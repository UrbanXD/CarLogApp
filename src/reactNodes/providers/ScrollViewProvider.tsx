import React, { Context, createContext, ReactNode, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

interface ScrollViewProviderValue {
    lastContentOffset: SharedValue<number>,
    isScrolling: SharedValue<boolean>,
}
const ScrollViewContext = createContext<ScrollViewProviderValue | null>(null);

export const ScrollViewProvider: React.FC<{ children: ReactNode | null }> = ({ children }) => {
    const lastContentOffset = useSharedValue(0);
    const isScrolling = useSharedValue(false);

    return (
        <ScrollViewContext.Provider
            value={{
                lastContentOffset,
                isScrolling,
            }}
        >
            { children }
        </ScrollViewContext.Provider>
    )
}

export const useScrollView = () => useContext<ScrollViewProviderValue>(ScrollViewContext as Context<ScrollViewProviderValue>);