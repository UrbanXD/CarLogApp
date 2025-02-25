import React, { createRef, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAlert } from "../../Alert/context/AlertProvider";
import BottomSheetBackdrop from "../components/BottomSheetBackdrop";
import BottomSheet from "../components/BottomSheet";
import { KeyboardController } from "react-native-keyboard-controller";
import { BottomSheetContext, BottomSheetType, OpenBottomSheetArgs } from "./BottomSheetContext.ts";
import { BottomSheetLeavingModal } from "../../Alert/presets/modal";

interface BottomSheetProviderProps {
    children: ReactNode | null
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
    children
}) => {
    const { openModal } = useAlert();

    const [bottomSheets, setBottomSheets] = useState<Array<BottomSheetType>>([]);
    const [manuallyClosed, setManuallyClosed] = useState<boolean>(false);

    useEffect(() => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        bottomSheet.ref.current?.present();
    }, [bottomSheets]);

    const getCurrentBottomSheet = useCallback(() => {
        const index = bottomSheets.length - 1;
        if(index < 0) return null;

        return bottomSheets[index];
    }, [bottomSheets])

    const openBottomSheet = useCallback((args: OpenBottomSheetArgs) => {
        const newBottomSheet = {
            ref: createRef<BottomSheetModal>(),
            props: args
        };

        setBottomSheets(prevState => {
            setManuallyClosed(true); // stack behaviour = "switch", bezarja, viszont jelezni kell, hogy manualisan tortent
            return [...prevState, newBottomSheet];
        });
    }, []);

    const closeBottomSheet = useCallback(() => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        bottomSheet.ref.current?.close();
    }, []);

    const dismissBottomSheet = useCallback(() => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        const temp = bottomSheet.props.enableDismissOnClose;
        bottomSheet.props.enableDismissOnClose = true;
        bottomSheet.ref.current?.dismiss();
        bottomSheet.props.enableDismissOnClose = temp;

        setBottomSheets(
            prevState =>
                prevState.slice(0, prevState.length - 1)
        );
    }, []);

    const dismissAllBottomSheet = useCallback(() => {
        setBottomSheets(prevState => {
            prevState.map(bottomSheet => {
                bottomSheet.props.enableDismissOnClose = true;
                bottomSheet.ref.current?.dismiss();
            });

            return new Array<BottomSheetType>();
        })
    }, []);

    const reopenBottomSheet = useCallback(() => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        bottomSheet.ref.current?.snapToIndex(0);
    }, [])

    const onChangeSnapPoint = useCallback((index: number) => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        if(index === -1) {
            KeyboardController.dismiss();

            if(manuallyClosed) return setManuallyClosed(false);

            if(!bottomSheet.props.enableDismissOnClose) {
                return openModal(
                    BottomSheetLeavingModal(
                        reopenBottomSheet,
                        dismissBottomSheet
                    )
                );
            }

            dismissBottomSheet();
        }
    }, []);

    const contextValue = useMemo(() => ({
        openBottomSheet,
        closeBottomSheet,
        dismissBottomSheet,
        dismissAllBottomSheet,
    }), [openBottomSheet, closeBottomSheet, dismissBottomSheet, dismissAllBottomSheet]);

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
                    />
                ))
            }
        </BottomSheetContext.Provider>
    )
}