import React, {forwardRef, ReactNode, useCallback, useImperativeHandle, useMemo} from "react";
import {StyleSheet, View, Text} from "react-native";
import {theme} from "../../constants/theme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import TextDivider from "../TextDivider/TextDivider";
import {DEFAULT_SEPARATOR, GLOBAL_STYLE, SEPARATOR_SIZES} from "../../constants/constants";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Backdrop from "./Backdrop";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetView
} from "@gorhom/bottom-sheet";

type BottomSheetProps = {
    title?: string
    children?: ReactNode
}

const CustomBottomSheet= forwardRef<BottomSheetModal, BottomSheetProps>(({ title = "Bottom Sheet", children }, ref) => {
    const bottomSheetSnapPoints = useMemo(() => ["40%", "60%", "80%"], []);

    return (
        <BottomSheetModal
            ref={ ref }
            index={ 2 }
            snapPoints={ bottomSheetSnapPoints }
            enablePanDownToClose={ true }
            backdropComponent={
                (props) =>
                    <BottomSheetBackdrop
                        appearsOnIndex={ 0 }
                        disappearsOnIndex={ -1 }
                        opacity={ 0.6 }
                        { ...props }
                    />
            }
            backgroundStyle={ styles.containerBackground }
            handleIndicatorStyle={ styles.line }
        >
            <View style={ styles.contentContainer }>
                <Text style={ styles.titleText }>
                    { title }
                </Text>
                <BottomSheetScrollView contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }>
                    { children }
                </BottomSheetScrollView>
            </View>
        </BottomSheetModal>
    )
})

const styles = StyleSheet.create({
    containerBackground: {
        backgroundColor: theme.colors.black,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        // zIndex: 99
    },
    contentContainer: {
        flex: 1,
        gap: DEFAULT_SEPARATOR,
        paddingHorizontal: DEFAULT_SEPARATOR,
    },
    line: {
        alignSelf: "center",
        marginTop: SEPARATOR_SIZES.normal,
        width: hp(15),
        height: hp(0.75),
        backgroundColor: theme.colors.white2,
        borderRadius: 35
    },
    titleText: {
        ...GLOBAL_STYLE.containerTitleText,
        textAlign: "center"
    }
})

export default CustomBottomSheet;