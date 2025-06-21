import { Context, createContext, useContext } from "react";
import { OpenBottomSheetArgs } from "../types/index.ts";

interface BottomSheetProviderValue {
    openBottomSheet: (args: OpenBottomSheetArgs) => void;
    closeBottomSheet: () => void;
    dismissBottomSheet: () => void;
    dismissAllBottomSheet: () => void;
}

export const BottomSheetContext =
    createContext<BottomSheetProviderValue | null>(null);

export const useBottomSheet = () =>
    useContext<BottomSheetProviderValue>(
        BottomSheetContext as Context<BottomSheetProviderValue>
    );