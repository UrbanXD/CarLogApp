import React, { ReactNode, useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { router, useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import type { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants";
import { BottomSheetProvider } from "../contexts/BottomSheetProvider";
import { MoreDataLoading } from "../../../components/loading/MoreDataLoading";

export interface BottomSheetProps extends Partial<BottomSheetModalProps> {
    title?: string;
    content: ReactNode;
    closeButton?: ReactNode;
    isLoading?: boolean;
    enableDismissOnClose?: boolean;
    maxDynamicContentSize?: number;
}

const ROUTE_SHEETS = [
    "auth/signIn", "auth/signUp", "auth/otpVerification", "auth/resetPassword", "user/edit",
    "car/create", "car/edit/[id]", "odometer/log/create", "odometer/log/edit/[id]",
    "expense/create", "expense/create/fuel", "expense/create/service", "expense/edit/[id]",
    "expense/edit/fuel/[id]", "expense/edit/service/[id]", "ride/place/create",
    "ride/place/edit/[id]", "ride/passenger/create", "ride/passenger/edit/[id]",
    "ride/create", "ride/edit/[id]"
];

const BottomSheet: React.FC<BottomSheetProps> = ({
    title,
    content,
    closeButton,
    isLoading,
    enableDismissOnClose = true,
    enableDynamicSizing = false,
    maxDynamicContentSize
}) => {
    const { width, height } = useWindowDimensions();
    const { top, bottom } = useSafeAreaInsets();
    const focused = useIsFocused();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const dialogHeight = Math.min(height * 0.9, maxDynamicContentSize ?? 820);
    const availableContentHeight = Math.max(240, dialogHeight - top - bottom - (title ? 100 : 32));

    const dismissBottomSheet = useCallback((dismissPreviousSheets = false) => {
        if(!dismissPreviousSheets) {
            if(router.canGoBack()) router.back();
            else router.replace("/" as never);
            return;
        }

        const routes = [...(navigation.getState()?.routes ?? [])];
        while(routes.length > 0) {
            const route = routes.pop();
            if(!route) continue;
            const cleanName = route.name.replace(/\/index$/, "");
            const isSheet = cleanName.startsWith("bottomSheet/") || ROUTE_SHEETS.includes(cleanName);
            if(isSheet) continue;

            let pathname = cleanName.startsWith("/") ? cleanName : `/${ cleanName }`;
            let params = { ...(route.params as Record<string, unknown> | undefined) };
            const activeIndex = route.state?.index;
            if(activeIndex !== undefined) {
                const activeRoute = route.state?.routes?.[activeIndex];
                if(activeRoute) {
                    pathname = `${ pathname }/${ activeRoute.name.replace(/\/index$/, "") }`.replace(/\/+/g, "/");
                    params = { ...params, ...(activeRoute.params as Record<string, unknown> | undefined) };
                }
            }

            router.dismissTo({ pathname: pathname as never, params } as never);
            return;
        }
        router.dismissTo("/" as never);
    }, [navigation]);

    const requestClose = useCallback(() => {
        if(enableDismissOnClose) return dismissBottomSheet();
        setConfirmDiscard(true);
    }, [dismissBottomSheet, enableDismissOnClose]);

    return (
        <Modal
            visible={ focused }
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={ requestClose }
        >
            <View style={ styles.overlay }>
                <Pressable style={ StyleSheet.absoluteFill } onPress={ requestClose } accessibilityRole="button"
                           accessibilityLabel="Close form"/>
                <View style={ [
                    styles.dialog, {
                        width: Math.min(880, width - 40),
                        maxWidth: Math.max(0, width - 40),
                        minWidth: 0,
                        height: enableDynamicSizing ? undefined : Math.min(height * 0.88, 820),
                        minHeight: enableDynamicSizing ? 230 : undefined,
                        maxHeight: dialogHeight
                    }
                ] }>
                    { (title || closeButton) && (
                        <View style={ styles.header }>
                            { closeButton }
                            { title && <Text style={ styles.title }>{ title }</Text> }
                            <Pressable style={ styles.close } onPress={ requestClose } accessibilityRole="button"
                                       accessibilityLabel="Close">
                                <Text style={ styles.closeText }>×</Text>
                            </Pressable>
                        </View>
                    ) }
                    <View style={ styles.content }>
                        <BottomSheetProvider contextValue={ { dismissBottomSheet, availableContentHeight } }>
                            { isLoading ? <MoreDataLoading/> : content }
                        </BottomSheetProvider>
                    </View>
                </View>
                { confirmDiscard && (
                    <View style={ styles.confirmOverlay }>
                        <View style={ styles.discardDialog }>
                            <Text style={ styles.discardTitle }>{ t("modal.bottom_sheet_leaving.title") }</Text>
                            <Text style={ styles.discardBody }>{ t("modal.bottom_sheet_leaving.body") }</Text>
                            <View style={ styles.discardActions }>
                                <Pressable style={ styles.keepEditingButton }
                                           onPress={ () => setConfirmDiscard(false) }>
                                    <Text style={ styles.keepEditingText }>{ t("form_button.cancel") }</Text>
                                </Pressable>
                                <Pressable style={ styles.discardButton } onPress={ () => dismissBottomSheet() }>
                                    <Text
                                        style={ styles.discardButtonText }>{ t("modal.bottom_sheet_leaving.accept") }</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ) }
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
        backgroundColor: "rgba(0, 0, 0, .66)"
    },
    confirmOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, .38)"
    },
    dialog: {
        boxSizing: "border-box",
        flexShrink: 1,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.gray4,
        borderRadius: 22,
        backgroundColor: COLORS.black2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
        elevation: 24
    },
    header: {
        minHeight: 70,
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        paddingHorizontal: SEPARATOR_SIZES.mediumSmall * 2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray4
    },
    title: {
        ...GLOBAL_STYLE.containerTitleText,
        flex: 1,
        fontSize: FONT_SIZES.h3,
        textAlign: "left"
    },
    close: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.black4
    },
    closeText: { color: COLORS.gray1, fontSize: 25, lineHeight: 28 },
    content: {
        boxSizing: "border-box",
        flex: 1,
        width: "100%",
        maxWidth: "100%",
        minHeight: 0,
        minWidth: 0,
        flexShrink: 1,
        alignSelf: "stretch",
        overflow: "hidden",
        paddingHorizontal: SEPARATOR_SIZES.mediumSmall * 2,
        paddingTop: SEPARATOR_SIZES.small,
        paddingBottom: SEPARATOR_SIZES.lightSmall
    },
    discardDialog: {
        width: "min(520px, calc(100vw - 40px))" as any,
        padding: DEFAULT_SEPARATOR * 2,
        borderWidth: 1,
        borderColor: COLORS.gray4,
        borderRadius: 18,
        backgroundColor: COLORS.black2,
        gap: SEPARATOR_SIZES.small
    },
    discardTitle: { color: COLORS.white, fontSize: FONT_SIZES.h3, fontFamily: "Gilroy-Heavy" },
    discardBody: { color: COLORS.gray1, fontSize: FONT_SIZES.p2, lineHeight: FONT_SIZES.p2 * 1.45 },
    discardActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: SEPARATOR_SIZES.small,
        marginTop: SEPARATOR_SIZES.small
    },
    keepEditingButton: {
        minHeight: 44,
        justifyContent: "center",
        paddingHorizontal: DEFAULT_SEPARATOR,
        borderRadius: 10,
        backgroundColor: COLORS.black4
    },
    keepEditingText: { color: COLORS.white, fontSize: FONT_SIZES.p3, fontFamily: "Gilroy-Medium" },
    discardButton: {
        minHeight: 44,
        justifyContent: "center",
        paddingHorizontal: DEFAULT_SEPARATOR,
        borderRadius: 10,
        backgroundColor: COLORS.fuelYellow
    },
    discardButtonText: { color: COLORS.black, fontSize: FONT_SIZES.p3, fontFamily: "Gilroy-Heavy" }
});

export default React.memo(BottomSheet);
