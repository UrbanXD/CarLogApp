import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {
    BottomSheetRoutes,
    COLORS,
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GLOBAL_STYLE,
    SEPARATOR_SIZES
} from "../../../constants/index.ts";
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import BottomSheetBackdrop from "./BottomSheetBackdrop.tsx";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { KeyboardController } from "react-native-keyboard-controller";
import { BottomSheetLeavingModal } from "../presets/modal/index.ts";
import { useAlert } from "../../alert/hooks/useAlert.ts";
import { BottomSheetProvider } from "../contexts/BottomSheetProvider.tsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface BottomSheetProps extends Partial<BottomSheetModalProps> {
    title?: string;
    content: ReactNode;
    closeButton?: ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
    title, content, closeButton, ...restProps
}) => {
    const { top } = useSafeAreaInsets();
    const { openModal } = useAlert();
    const navigation = useNavigation();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const manuallyClosed = useRef(false);
    const forceClosed = useRef(false);

    const { snapPoints, enableHandlePanningGesture, enableDynamicSizing, enableDismissOnClose } = restProps;

    const isBottomSheet = (pathname?: string) => !!pathname?.startsWith("bottomSheet") || BottomSheetRoutes.includes(
        pathname);

    useFocusEffect(
        useCallback(() => {
            bottomSheetRef.current?.present(); // when route focused

            return () => {
                // when route not focused
                const stackOfRoutes = navigation.getState()?.routes;
                const newStackPathname = stackOfRoutes?.[stackOfRoutes?.length - 1]?.name;

                if(isBottomSheet(newStackPathname)) {
                    manuallyClosed.current = true;
                    bottomSheetRef.current?.forceClose();
                }
            };
        }, [])
    );

    useEffect(() => {
        return navigation.addListener("beforeRemove", (_event) => {
            forceClosed.current = true;
            KeyboardController.dismiss();
            bottomSheetRef.current?.dismiss();
        });
    }, []);

    useEffect(() => {
        Keyboard.addListener("keyboardDidHide", () => {
            bottomSheetRef.current?.snapToIndex(0);
        });
    }, []);

    const reopenBottomSheet = useCallback(() => {
        bottomSheetRef.current.expand();
    }, []);

    const dismissBottomSheet = useCallback((dismissPreviousSheets = false) => {
        forceClosed.current = true;
        KeyboardController.dismiss();
        bottomSheetRef.current?.dismiss();

        if(!dismissPreviousSheets && router.canDismiss()) return router.dismiss();
        const stackOfRoutes = [...(navigation.getState()?.routes ?? [])];
        if(stackOfRoutes.length - 1 <= 0) return router.replace("backToRootIndex");

        while(stackOfRoutes.length > 0) {
            const route = stackOfRoutes.pop();
            if(!route) continue;
            if(!route.name.startsWith("bottomSheet/") && !BottomSheetRoutes.includes(route.name)) {
                router.dismissTo({ pathname: route.name, params: route.params });
                return;
            }
        }

        router.dismissTo("backToRootIndex");
    }, [navigation]);

    const onChangeSnapPoint = useCallback((index: number) => {
        if(index !== -1) return; // not closed

        KeyboardController.dismiss();

        if(!bottomSheetRef.current) return; // return if already removed from route stack
        if(manuallyClosed.current) return manuallyClosed.current = false;
        if(forceClosed.current) return;
        if(enableDismissOnClose) return dismissBottomSheet();

        openModal(BottomSheetLeavingModal(reopenBottomSheet, dismissBottomSheet));
    }, [reopenBottomSheet, dismissBottomSheet]);

    const renderBackdrop = useMemo(() => (props: BottomSheetBackdropProps) => <BottomSheetBackdrop { ...props }/>);

    const styles = useStyles(snapPoints?.[0] === "100%", !!enableHandlePanningGesture, !!enableDynamicSizing);

    return (
        <BottomSheetModal
            ref={ bottomSheetRef }
            { ...restProps }
            topInset={ top }
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustPan"
            enableBlurKeyboardOnGesture
            backgroundStyle={ styles.containerBackground }
            handleIndicatorStyle={ styles.line }
            backdropComponent={ renderBackdrop }
            onChange={ onChangeSnapPoint }
        >
            <BottomSheetView style={ styles.container }>
                {
                    title &&
                   <View>
                       { closeButton }
                      <Text style={ styles.titleText }>
                          { title }
                      </Text>
                   </View>
                }
                <BottomSheetProvider contextValue={ { dismissBottomSheet } }>
                    { content }
                </BottomSheetProvider>
            </BottomSheetView>
        </BottomSheetModal>
    );
};

const useStyles = (
    isFullScreen: boolean,
    isHandlePanningGesture: boolean,
    enableDynamicSizing: number
) => StyleSheet.create({
    container: {
        flex: 1,
        height: enableDynamicSizing ? undefined : "100%",
        gap: DEFAULT_SEPARATOR,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingBottom: SEPARATOR_SIZES.small
    },
    containerBackground: {
        backgroundColor: COLORS.black2,
        borderColor: COLORS.gray4,
        borderTopWidth: !isFullScreen ? 0.75 : 0,
        borderLeftWidth: !isFullScreen ? 0.5 : 0,
        borderRightWidth: !isFullScreen ? 0.5 : 0,
        borderTopLeftRadius: !isFullScreen ? 55 : 0,
        borderTopRightRadius: !isFullScreen ? 55 : 0
    },
    line: {
        alignSelf: "center",
        marginTop: SEPARATOR_SIZES.small,
        marginBottom: SEPARATOR_SIZES.lightSmall,
        width: hp(15),
        backgroundColor: COLORS.white2,
        borderRadius: 35
    },
    titleText: {
        ...GLOBAL_STYLE.containerTitleText,
        fontSize: FONT_SIZES.h2,
        textAlign: "center"
    }
});

export default React.memo(BottomSheet);