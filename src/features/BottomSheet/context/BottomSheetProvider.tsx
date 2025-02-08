import React, { Context, createContext, createRef, ReactNode, RefObject, useContext, useMemo, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import { useAlert } from "../../Alert/context/AlertProvider";
import { bottomSheetLeavingModal } from "../../Alert/layouts/modal/bottomSheetLeavingModal";
import BottomSheetBackdrop from "../components/BottomSheetBackdrop";
import BottomSheet from "../components/BottomSheet";
import { KeyboardController } from "react-native-keyboard-controller";

export interface OpenBottomSheetArgs extends Partial<BottomSheetModalProps> {
    title?: string,
    content: ReactNode,
    closeButton?: ReactNode
}

type BottomSheet = {
    ref: RefObject<BottomSheetModal>
    props: OpenBottomSheetArgs
}

interface BottomSheetProviderValue {
    openBottomSheet: (args: OpenBottomSheetArgs) => void
    closeBottomSheet: () => void
    dismissBottomSheet: () => void
}

const BottomSheetContext = createContext<BottomSheetProviderValue | null>(null);

interface BottomSheetProviderProps {
    children: ReactNode | null
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
    children
}) => {
    const { openModal } = useAlert();

    const [bottomSheets, setBottomSheets] = useState<Array<BottomSheet>>([]);
    const [isManuallyClosed, setIsManuallyClosed] = useState<boolean>(false);

    const openBottomSheet = (args: OpenBottomSheetArgs) => {
        const ref = createRef<BottomSheetModal>();

        setBottomSheets(prevState => {
            const prevLastIndex = prevState.length - 1;
            if(prevLastIndex >= 0) {
                prevState[prevLastIndex]?.ref.current?.close();
                setIsManuallyClosed(true);
            }

            return [...prevState, { ref, props: args }]
        });
        setTimeout(() => ref.current?.present(), 0);
    }

    const getCurrentBottomSheet = () => {
        const index = bottomSheets.length - 1;
        if(index < 0) return null;

        return bottomSheets[index];
    }

    const closeBottomSheet = () => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        bottomSheet.ref.current?.close();
    }

    const dismissBottomSheet = () => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        setBottomSheets(
            prevState => {
                const lastIndex = prevState.length - 1;
                if(lastIndex < 0) return new Array<BottomSheet>();
                prevState[lastIndex].ref.current?.dismiss();

                const newLastIndex = lastIndex - 1;
                if(newLastIndex < 0) return new Array<BottomSheet>();
                prevState[newLastIndex]?.ref?.current?.present();

                return prevState.slice(0, newLastIndex + 1);
            }
        );
    }

    const reopenBottomSheet = () => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        bottomSheet.ref.current?.snapToIndex(0);
    }

    const onChangeSnapPoint = (index: number) => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        if(index === -1) {
            KeyboardController.dismiss();
            if(isManuallyClosed) return setIsManuallyClosed(false);

            if(!bottomSheet.props.enableDismissOnClose) {
                return openModal(
                    bottomSheetLeavingModal(
                        reopenBottomSheet,
                        dismissBottomSheet
                    )
                );
            }

            dismissBottomSheet();
        }
    }

    const contextValue = useMemo(() => ({
        openBottomSheet,
        closeBottomSheet,
        dismissBottomSheet,
    }), [openBottomSheet, closeBottomSheet, dismissBottomSheet]);

    return (
        <BottomSheetContext.Provider
            value={ contextValue }
        >
            { children }
            {
                bottomSheets.map(({ ref, props }, index) => (
                    <BottomSheet
                        key={ index }
                        ref={ ref }
                        index={ 0 }
                        enableHandlePanningGesture
                        enableContentPanningGesture
                        enableDismissOnClose
                        enableOverDrag={ false }
                        backdropComponent={ () => <BottomSheetBackdrop /> }
                        onChange={ onChangeSnapPoint }
                        { ...props }
                        snapPoints={ props.snapPoints || ["100%"] }
                        dismissBottomSheet={ () => dismissBottomSheet(id) }
                        closeBottomSheet={ () => closeBottomSheet(id) }
                    />
                ))
            }
        </BottomSheetContext.Provider>
    )
}

export const useBottomSheet = () =>
    useContext<BottomSheetProviderValue>(
        BottomSheetContext as Context<BottomSheetProviderValue>
    );