import { useBottomSheetInternal } from "@gorhom/bottom-sheet";

export const useSafeBottomSheetInternal = (): ReturnType<typeof useBottomSheetInternal> | undefined => {
    try {
        return useBottomSheetInternal();
    } catch {
        return undefined;
    }
};