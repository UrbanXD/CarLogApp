import React, {Context, createContext, ReactElement, ReactNode, useCallback, useContext, useRef, useState} from "react";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import CustomBottomSheet from "../components/shared/BottomSheet";

interface OpenBottomSheetArgs {
    title: string,
    content: ReactElement,
    snapPoints?: Array<string>,
    startSnapIndex?: number,
    isHandlePanningGesture?: boolean,
    renderCloseButton?: () => ReactNode
}

interface BottomSheetProviderValue {
    openBottomSheet: (args: OpenBottomSheetArgs) => void
    closeBottomSheet: () => void
}

const BottomSheetContext = createContext<BottomSheetProviderValue | null>(null);

interface BottomSheetProviderProps {
    children: ReactNode | null
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const [bottomSheetTitle, setBottomSheetTitle] = useState("");
    const [bottomSheetContent, setBottomSheetContent] = useState<ReactElement | null>(null);
    const [snapPoints, setSnapPoints] = useState<Array<string> | undefined>();
    const [startSnapIndex, setStartSnapIndex] = useState<number | undefined>();
    const [isHandlePanningGesture, setIsHandlePanningGesture] = useState<boolean | undefined>();
    const [renderCloseButton, setRenderCloseButton] = useState<(() => ReactNode) | undefined>();

    const openBottomSheet = useCallback((args: OpenBottomSheetArgs) => {
        setBottomSheetTitle(args.title);
        setBottomSheetContent(args.content);
        setSnapPoints(args.snapPoints);
        setStartSnapIndex(args.startSnapIndex);
        setIsHandlePanningGesture(args.isHandlePanningGesture);
        setRenderCloseButton(args.renderCloseButton);

        bottomSheetModalRef.current?.present();
    }, []);

    const closeBottomSheet = () => bottomSheetModalRef?.current?.close()

    return (
        <BottomSheetContext.Provider
            value={{
                openBottomSheet,
                closeBottomSheet
            }}
        >
            { children }
            <CustomBottomSheet
                ref={ bottomSheetModalRef }
                title={ bottomSheetTitle }
                snapPoints={ snapPoints }
                startSnapIndex={ startSnapIndex }
                isHandlePanningGesture={ isHandlePanningGesture }
                renderCloseButton={ renderCloseButton }
            >
                { bottomSheetContent }
            </CustomBottomSheet>
        </BottomSheetContext.Provider>
    )
}

export const useBottomSheet = () => useContext<BottomSheetProviderValue>(BottomSheetContext as Context<BottomSheetProviderValue>);