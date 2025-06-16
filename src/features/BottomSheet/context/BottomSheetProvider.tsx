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
    const [bottomSheetOpenable, setBottomSheetOpenable] = useState<boolean>(true);

    useEffect(() => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        bottomSheet.ref.current?.present();
        bottomSheet.ref.current?.snapToIndex(0);
    }, [bottomSheets]);

    const getCurrentBottomSheet = useCallback(() => {
        const index = bottomSheets.length - 1;
        if(index < 0) return null;

        return bottomSheets[index];
    }, [bottomSheets])

    const openBottomSheet = useCallback((args: OpenBottomSheetArgs) => {
        if(!bottomSheetOpenable) return;
        setBottomSheetOpenable(false);

        const newBottomSheet: BottomSheetType = {
            ref: createRef<BottomSheetModal>(),
            props: args
        };

        setBottomSheets(prevState => {
            if(prevState.length >= 1) setManuallyClosed(true); // stack behaviour = "switch", bezarja, viszont jelezni kell, hogy manualisan tortent
            setTimeout(() => setBottomSheetOpenable(true), 500);

            return [...prevState, newBottomSheet];
        });
    }, [bottomSheetOpenable]);

    const closeBottomSheet = useCallback(() => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        bottomSheet.ref.current?.close();
    }, [getCurrentBottomSheet]);

    const dismissBottomSheet = useCallback(() => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        const temp = bottomSheet.props.enableDismissOnClose;
        bottomSheet.props.enableDismissOnClose = true;
        bottomSheet.ref.current?.dismiss();
        bottomSheet.props.enableDismissOnClose = temp;

        setBottomSheets(prevState => prevState.slice(0, prevState.length - 1));
    }, [getCurrentBottomSheet]);

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
    }, [getCurrentBottomSheet])

    const onChangeSnapPoint = useCallback((index: number) => {
        const bottomSheet = getCurrentBottomSheet();
        if(!bottomSheet) return;

        if(index === -1) {
            KeyboardController.dismiss();

            if(manuallyClosed) return setManuallyClosed(false); // manualis bezaras eseten semmit ne csinaljon
            if(bottomSheet.props.enableDismissOnClose) return dismissBottomSheet(); // ha azonnal bezarhato akkor vegezze el

            openModal(BottomSheetLeavingModal(reopenBottomSheet, dismissBottomSheet));
        }
    }, [bottomSheets, getCurrentBottomSheet, manuallyClosed]);

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