import React, { forwardRef, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../../constants/theme";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/constants";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import BottomSheetBackdrop from "./BottomSheetBackdrop";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContext, useBottomSheet } from "../context/BottomSheetContext.ts";

interface BottomSheetProps extends Partial<BottomSheetModalProps> {
    title?: string
    content: ReactNode
    closeButton?: ReactNode
}

const BottomSheet=
    forwardRef<BottomSheetModal, BottomSheetProps>((props, ref) => {
        const {
            title,
            content,
            closeButton,
            ...restProps
        } = props;

        const { snapPoints, enableHandlePanningGesture } = restProps;

        const { top } = useSafeAreaInsets();
        const snaps = snapPoints as Array<string | number> || [];
        const styles = useStyles(snaps[0] === "100%", !!enableHandlePanningGesture, top);

        return (
            <BottomSheetModal
                ref={ ref }
                { ...restProps }
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                android_keyboardInputMode="adjustPan"
                stackBehavior="switch"
                backdropComponent={
                    (props: any) =>
                        <BottomSheetBackdrop { ...props } />
                }
                topInset={ top }
                backgroundStyle={ styles.containerBackground }
                handleIndicatorStyle={ styles.line }
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
                    <BottomSheetContext.Provider value={ useBottomSheet() }>
                        { content }
                    </BottomSheetContext.Provider>
                </BottomSheetView>
            </BottomSheetModal>
        )
    })

const useStyles = (isFullScreen: boolean, isHandlePanningGesture: boolean, top: number) =>
    StyleSheet.create({
        container: {
            flex: 1,
            gap: DEFAULT_SEPARATOR,
            paddingHorizontal: DEFAULT_SEPARATOR,
            paddingTop: top / 3, //padding vertical nem jo
            paddingBottom: DEFAULT_SEPARATOR
        },
        containerBackground: {
            backgroundColor: theme.colors.black,
            borderTopLeftRadius: !isFullScreen ? 55 : 0,
            borderTopRightRadius: !isFullScreen ? 55 : 0,
        },
        line: {
            alignSelf: "center",
            marginTop: SEPARATOR_SIZES.normal,
            width: hp(15),
            height: isHandlePanningGesture ? hp(0.75) : 0,
            backgroundColor: theme.colors.white2,
            borderRadius: 35
        },
        titleText: {
            ...GLOBAL_STYLE.containerTitleText,
            fontSize: FONT_SIZES.medium,
            textAlign: "center"
        },
    })

export default React.memo(BottomSheet);