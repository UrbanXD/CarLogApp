import { SharedValue } from "react-native-reanimated";
import { Context, createContext, useContext } from "react";

type ScreenScrollViewContextValue = {
    offset: SharedValue<number>
}

export const ScreenScrollViewContext = createContext<ScreenScrollViewContextValue | null>(null);

export const useScreenScrollView = () => useContext<ScreenScrollViewContextValue>(
    ScreenScrollViewContext as Context<ScreenScrollViewContextValue>
);