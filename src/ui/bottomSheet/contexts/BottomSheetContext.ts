import { Context, createContext, useContext } from "react";

export type BottomSheetProviderValue = {
    dismissBottomSheet?: (dismissPreviousSheets?: boolean) => void
}

export const BottomSheetContext = createContext<BottomSheetProviderValue>({});

export const useBottomSheet = () => useContext<BottomSheetProviderValue>(BottomSheetContext as Context<BottomSheetProviderValue>);