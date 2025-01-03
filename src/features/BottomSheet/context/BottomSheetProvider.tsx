import React, {
    Context,
    createContext,
    ReactElement,
    ReactNode,
    useCallback,
    useContext, useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import { useAlert } from "../../Alert/context/AlertProvider";
import { bottomSheetLeavingModal } from "../../Alert/layouts/modal/bottomSheetLeavingModal";
import BottomSheetBackdrop from "../components/BottomSheetBackdrop";
import BottomSheet from "../components/BottomSheet";
import { KeyboardController } from "react-native-keyboard-controller";

export interface OpenBottomSheetArgs extends Partial<BottomSheetModalProps> {
    title?: string,
    content: ReactElement,
    closeButton?: ReactElement
}

interface BottomSheetProviderValue {
    openBottomSheet: (args: OpenBottomSheetArgs) => void
    closeBottomSheet: () => void
    forceCloseBottomSheet: () => void
}

const BottomSheetContext = createContext<BottomSheetProviderValue | null>(null);

interface BottomSheetProviderProps {
    children: ReactNode | null
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const { openModal } = useAlert();

    const [bottomSheetTitle, setBottomSheetTitle] = useState<string | undefined>();
    const [bottomSheetContent, setBottomSheetContent] = useState<ReactElement | undefined>();
    const [bottomSheetCloseButton, setBottomSheetCloseButton] = useState<ReactElement | undefined>();
    const [bottomSheetProps, setBottomSheetProps] = useState<Partial<BottomSheetModalProps> | null>(null);
    const bottomSheetPropsRef = useRef(bottomSheetProps);

    useEffect(() => {
        bottomSheetPropsRef.current = bottomSheetProps;
    }, [bottomSheetProps]);

    const openBottomSheet =
        useCallback(
        (args: OpenBottomSheetArgs) => {
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
                enableDismissOnClose: true,
                enableOverDrag: false,
                backdropComponent: () => <BottomSheetBackdrop />,
                onChange: onChangeSnapPoint,
                ...restProps
            });

            bottomSheetModalRef.current?.present();
        }, [bottomSheetModalRef]);

    const closeBottomSheet =
        useCallback(
        () => {
            bottomSheetModalRef?.current?.close();
        },[bottomSheetModalRef]);

    const forceCloseBottomSheet =
        useCallback(
        () => {
            if(!bottomSheetPropsRef.current?.enableDismissOnClose) {
                bottomSheetPropsRef.current = {
                    ...bottomSheetPropsRef.current,
                    enableDismissOnClose: true
                }
                setBottomSheetProps(prevBottomSheetProps => {
                    return {
                        ...prevBottomSheetProps,
                        enableDismissOnClose: true
                    };
                })
            }

            closeBottomSheet();
        }, [bottomSheetModalRef]);

    const reopenBottomSheet =
        useCallback(
        () => {
            bottomSheetModalRef?.current?.snapToIndex(0);
        }, [bottomSheetModalRef]);

    const onChangeSnapPoint =
        useCallback(
        (index: number) => {
            if (index === -1 && !bottomSheetPropsRef.current?.enableDismissOnClose) {
                KeyboardController.dismiss();
                openModal(bottomSheetLeavingModal(reopenBottomSheet, forceCloseBottomSheet));
            }
        }, [bottomSheetPropsRef]);


    const contextValue = useMemo(() => ({
        openBottomSheet,
        closeBottomSheet,
        forceCloseBottomSheet,
    }), [openBottomSheet, closeBottomSheet, forceCloseBottomSheet]);

    return (
        <BottomSheetContext.Provider
            value={ contextValue }
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