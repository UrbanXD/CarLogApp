import { Context, createContext, ReactNode, RefObject, useContext } from "react";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export type BottomSheetType = {
    ref: RefObject<BottomSheetModal>
    props: OpenBottomSheetArgs
    manuallyClosed: boolean
    forceClose: boolean
}

export interface OpenBottomSheetArgs extends Partial<BottomSheetModalProps> {
    title?: string,
    content: ReactNode,
    closeButton?: ReactNode
}

interface BottomSheetProviderValue {
    openBottomSheet: (args: OpenBottomSheetArgs) => void
    closeBottomSheet: () => void
    dismissBottomSheet: () => void
    dismissAllBottomSheet: () => void
}

export const BottomSheetContext =
    createContext<BottomSheetProviderValue | null>(null);

export const useBottomSheet = () =>
    useContext<BottomSheetProviderValue>(
        BottomSheetContext as Context<BottomSheetProviderValue>
    );