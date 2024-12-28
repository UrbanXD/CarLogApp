import React, {
    Context,
    createContext,
    ReactElement,
    ReactNode,
    useCallback,
    useContext,
    useRef,
    useState
} from "react";
import {BottomSheetModal, BottomSheetProps} from "@gorhom/bottom-sheet";
import CustomBottomSheet from "../components/BottomSheet";
import {useKeyboard} from "@gorhom/bottom-sheet/lib/typescript/hooks";
import {debounce} from "react-native-keyboard-controller/lib/typescript/components/KeyboardAwareScrollView/utils";
import {Keyboard, StyleSheet} from "react-native";
import {runOnJS} from "react-native-reanimated";
import {BottomSheetModalProps} from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import {useAlert} from "../../alert/context/AlertProvider";
import {bottomSheetLeavingModal} from "../../alert/layouts/modal/bottomSheetLeavingModal";
import BottomSheetBackdrop from "../components/BottomSheetBackdrop";
import BottomSheet from "../components/BottomSheet";

export interface OpenBottomSheetArgs extends Partial<BottomSheetModalProps> {
    title: string,
    content: ReactElement,
    closeButton?: ReactElement
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

    const { openModal } = useAlert();

    const [bottomSheetTitle, setBottomSheetTitle] = useState("");
    const [bottomSheetContent, setBottomSheetContent] = useState<ReactElement | undefined>();
    const [bottomSheetCloseButton, setBottomSheetCloseButton] = useState<ReactElement | undefined>();
    const [bottomSheetProps, setBottomSheetProps] = useState<Partial<BottomSheetModalProps> | null>(null);

    const openBottomSheet =
        useCallback((args: OpenBottomSheetArgs) => {
            const {
                title,
                content,
                closeButton,
                ...restProps
            } = args;

            setBottomSheetTitle(title);
            setBottomSheetContent(content);
            setBottomSheetCloseButton(closeButton);
            setBottomSheetProps({
                snapPoints: ["100%"],
                index: 0,
                enableHandlePanningGesture: true,
                enableContentPanningGesture: true,
                enableDismissOnClose: false,
                enableOverDrag: false,
                backdropComponent: () => <BottomSheetBackdrop />,
                onChange: onChangeSnapPoint,
                ...restProps
            });

            bottomSheetModalRef.current?.present();
        }, [bottomSheetTitle, bottomSheetContent, bottomSheetProps, bottomSheetCloseButton]);

    const closeBottomSheet =
        useCallback(() =>
            bottomSheetModalRef?.current?.close()
        ,[bottomSheetModalRef])

    const forceCloseBottomSheet =
        () => {
            setBottomSheetProps(prevBottomSheetProps => {
                return {
                    ...prevBottomSheetProps,
                    enableDismissOnClose: true
                } as BottomSheetModalProps;
            })
            bottomSheetModalRef?.current?.dismiss();
        }

    const reopenBottomSheet =
        () =>
            bottomSheetModalRef?.current?.snapToIndex( 0);

    const onChangeSnapPoint =
        (index: number) => {
            if(index === -1) {
                openModal(bottomSheetLeavingModal(reopenBottomSheet, forceCloseBottomSheet));
            }
        }

    return (
        <BottomSheetContext.Provider
            value={{
                openBottomSheet,
                closeBottomSheet
            }}
        >
            { children }
            <BottomSheet
                ref={ bottomSheetModalRef }
                { ...bottomSheetProps }
                title={ bottomSheetTitle }
                renderContent={ () => bottomSheetContent }
                renderCloseButton={ () => bottomSheetCloseButton }
                reopen={ reopenBottomSheet }
                forceClose={ forceCloseBottomSheet }
            />
        </BottomSheetContext.Provider>
    )
}

export const useBottomSheet =
    () =>
        useContext<BottomSheetProviderValue>(
            BottomSheetContext as Context<BottomSheetProviderValue>
        );