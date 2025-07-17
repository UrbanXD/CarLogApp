import React, { forwardRef, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetBackdrop from "./BottomSheetBackdrop.tsx";

interface BottomSheetProps extends Partial<BottomSheetModalProps> {
    title?: string;
    content: ReactNode;
    closeButton?: ReactNode;
}

const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>((props, ref) => {
    const { title, content, closeButton, ...restProps } = props;
    const { snapPoints, enableHandlePanningGesture, enableDynamicSizing } = restProps;

    const { top } = useSafeAreaInsets();
    const snaps = snapPoints as Array<string | number> || [];
    const styles = useStyles(snaps[0] === "100%", !!enableHandlePanningGesture, top, !!enableDynamicSizing);

    return (
        <BottomSheetModal
            ref={ ref }
            index={ 0 }
            enableHandlePanningGesture
            enableContentPanningGesture
            enableDismissOnClose
            enableOverDrag
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustPan"
            { ...restProps }
            topInset={ top }
            backgroundStyle={ styles.containerBackground }
            handleIndicatorStyle={ styles.line }
            backdropComponent={ (props) => <BottomSheetBackdrop { ...props } /> }
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
                { content }
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const useStyles = (
    isFullScreen: boolean,
    isHandlePanningGesture: boolean,
    top: number,
    enableDynamicSizing: number
) => StyleSheet.create({
    container: {
        flex: 1,
        height: enableDynamicSizing ? undefined : "100%",
        gap: DEFAULT_SEPARATOR,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingBottom: SEPARATOR_SIZES.lightSmall
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