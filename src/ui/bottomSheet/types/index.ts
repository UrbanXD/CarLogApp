import { ReactNode, RefObject } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";

export interface OpenBottomSheetArgs extends Partial<BottomSheetModalProps> {
    title?: string,
    content: ReactNode,
    closeButton?: ReactNode
}

export type BottomSheetType = {
    ref: RefObject<BottomSheetModal>
    props: OpenBottomSheetArgs
    manuallyClosed: boolean
    forceClose: boolean
}
