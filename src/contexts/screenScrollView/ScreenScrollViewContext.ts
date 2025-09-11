import { SharedValue } from "react-native-reanimated";
import { Context, createContext, useContext } from "react";

type ScreenScrollViewContextValue = {
    y: SharedValue<number>
    distanceFromBottom: SharedValue<number>
    scrollDirection: SharedValue<"up" | "down">
    isScrolling: SharedValue<boolean>
}

export const ScreenScrollViewContext = createContext<ScreenScrollViewContextValue | null>(null);

export const useScreenScrollView = () => useContext<ScreenScrollViewContextValue>(ScreenScrollViewContext as Context<ScreenScrollViewContextValue>);