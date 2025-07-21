import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import BottomSheetBackdrop from "./BottomSheetBackdrop.tsx";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { KeyboardController } from "react-native-keyboard-controller";
import { BottomSheetLeavingModal } from "../presets/modal/index.ts";
import { useAlert } from "../../alert/hooks/useAlert.ts";
import { BottomSheetProvider } from "../contexts/BottomSheetProvider.tsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetProps extends Partial<BottomSheetModalProps> {
    title?: string;
    content: ReactNode;
    closeButton?: ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
    title, content, closeButton, ...restProps
}) => {
    const { top, bottom } = useSafeAreaInsets();
    const { openModal } = useAlert();
    const navigation = useNavigation();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const stackOfRouterLength = useRef(0);
    const manuallyClosed = useRef(false);
    const forceClosed = useRef(false);

    const { snapPoints, enableHandlePanningGesture, enableDynamicSizing, enableDismissOnClose } = restProps;

    const isBottomSheet = (pathname?: string) => !!pathname?.startsWith("bottomSheet");

    useEffect(() => {
        navigation.addListener("beforeRemove", () => {
            bottomSheetRef.current.dismiss();
        });
    }, []);

    useFocusEffect(useCallback(() => {
        const stackOfRoutes = navigation.getState()?.routes;
        stackOfRouterLength.current = stackOfRoutes?.length ?? 0;

        if(stackOfRouterLength.current !== 0) {
            bottomSheetRef.current.present();
        }

        return () => {
            const stackOfRoutes = navigation.getState()?.routes;
            const newStackLength = stackOfRoutes?.length;
            const newStackPathname = stackOfRoutes?.[newStackLength - 1].name;

            if(isBottomSheet(newStackPathname) && newStackLength > stackOfRouterLength.current) {
                manuallyClosed.current = true;
            }

            KeyboardController.dismiss();
            bottomSheetRef.current?.close();
        };
    }));

    const reopenBottomSheet = useCallback(() => {
        bottomSheetRef.current.expand();
    }, []);

    const dismissBottomSheet = useCallback((dismissPreviousSheets = false) => {
        forceClosed.current = true;
        KeyboardController.dismiss();
        bottomSheetRef.current?.dismiss();

        if(!dismissPreviousSheets && router.canDismiss()) return router.dismiss();

        const stackOfRoutes = [...(navigation.getState()?.routes ?? [])];
        if(stackOfRoutes.length === 0) return router.replace("backToIndex");

        while(stackOfRoutes.length > 0) {
            const route = stackOfRoutes.pop();
            if(!route) continue;
            if(!route.name.startsWith("bottomSheet/")) router.dismissTo(route.name);
        }
    }, [navigation]);

    const onChangeSnapPoint = useCallback((index: number) => {
        if(index !== -1) return; // nincs bezarva
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
            bottomInset={ bottom }
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustPan"
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