import React, { ReactNode } from "react";
import { BottomSheetContext, BottomSheetProviderValue } from "./BottomSheetContext.ts";

type BottomSheetProviderProps = {
    children: ReactNode | null
    contextValue: BottomSheetProviderValue
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
    children,
    contextValue
}) => {
    return (
        <BottomSheetContext.Provider
            value={ contextValue }
        >
            { children }
        </BottomSheetContext.Provider>
    );
};