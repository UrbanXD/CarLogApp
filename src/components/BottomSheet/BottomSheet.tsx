import React, { forwardRef, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import BottomSheetBackdrop from "./BottomSheetBackdrop.tsx";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetContext, useBottomSheet } from "../../contexts/BottomSheet/BottomSheetContext.ts";

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
                enableDynamicSizing={ false }
                topInset={ top }
                backgroundStyle={ styles.containerBackground }
                handleIndicatorStyle={ styles.line }
            >
                <BottomSheetView style={ styles.container } >
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
            paddingBottom: DEFAULT_SEPARATOR,
        },
        containerBackground: {
            backgroundColor: COLORS.black,
            borderTopLeftRadius: !isFullScreen ? 55 : 0,
            borderTopRightRadius: !isFullScreen ? 55 : 0,
        },
        line: {
            alignSelf: "center",
            marginTop: SEPARATOR_SIZES.small,
            marginBottom: SEPARATOR_SIZES.lightSmall,
            width: hp(15),
            height: isHandlePanningGesture ? hp(0.65) : 0,
            backgroundColor: COLORS.white2,
            borderRadius: 35
        },
        titleText: {
            ...GLOBAL_STYLE.containerTitleText,
            fontSize: FONT_SIZES.h2,
            textAlign: "center"
        },
    })

export default React.memo(BottomSheet);