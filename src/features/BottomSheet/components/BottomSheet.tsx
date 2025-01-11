import React, { forwardRef, ReactNode } from "react";
import {StyleSheet, Text, View} from "react-native";
import { theme } from "../../Shared/constants/theme";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES} from "../../Shared/constants/constants";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BottomSheetBackdrop from "./BottomSheetBackdrop";
import { BottomSheetModalProps } from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {FlatList} from "react-native-gesture-handler";

interface BottomSheetProps extends Partial<BottomSheetModalProps> {
    title?: string
    content: ReactNode
    buttons?: ReactNode
    closeButton?: ReactNode
    reopen: () => void,
    forceClose: () => void
}

const BottomSheet=
    forwardRef<BottomSheetModal, BottomSheetProps>((props, ref) => {
        const {
            title,
            content,
            buttons,
            closeButton,
            reopen,
            forceClose,
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
                backdropComponent={ (props: any) => <BottomSheetBackdrop { ...props } /> }
                backgroundStyle={ styles.containerBackground }
                handleIndicatorStyle={ styles.line }
            >
                <View style={ styles.contentContainer }>
                    <View style={ styles.titleContainer }>
                        { closeButton }
                        {
                            title &&
                            <Text style={ styles.titleText }>
                                { title }
                            </Text>
                        }
                    </View>
                    <FlatList
                        data={[]}
                        renderItem={() => <></>}
                        ListEmptyComponent={
                            <>
                                { content }
                            </>
                        }
                    />
                    { buttons }
                </View>
            </BottomSheetModal>
        )
    })

const useStyles = (isFullScreen: boolean, isHandlePanningGesture: boolean, top: number) =>
    StyleSheet.create({
        containerBackground: {
            backgroundColor: theme.colors.black,
            borderTopLeftRadius: !isFullScreen ? 55 : 0,
            borderTopRightRadius: !isFullScreen ? 55 : 0,
        },
        contentContainer: {
            flex: 1,
            gap: DEFAULT_SEPARATOR,
            paddingHorizontal: DEFAULT_SEPARATOR,
            paddingBottom: SEPARATOR_SIZES.small
        },
        line: {
            alignSelf: "center",
            marginTop: SEPARATOR_SIZES.normal,
            width: hp(15),
            height: isHandlePanningGesture ? hp(0.75) : 0,
            backgroundColor: theme.colors.white2,
            borderRadius: 35
        },
        titleContainer: {
            paddingVertical: top / 2.5
        },
        titleText: {
            ...GLOBAL_STYLE.containerTitleText,
            fontSize: FONT_SIZES.medium,
            textAlign: "center"
        },
    })

export default React.memo(BottomSheet);