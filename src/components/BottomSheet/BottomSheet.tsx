import React, {forwardRef, useCallback, useImperativeHandle} from "react";
import {StyleSheet, View, Text} from "react-native";
import {theme} from "../../constants/theme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import TextDivider from "../TextDivider/TextDivider";
import {DEFAULT_SEPARATOR, SEPARATOR_SIZES} from "../../constants/constants";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Backdrop from "./Backdrop";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type BottomSheetProps = {
    heightPercentage?: number,
    children?: React.ReactNode
}

export interface BottomSheetMethods {
    expand: () => void
    close: () => void
}

const BottomSheet= forwardRef<BottomSheetMethods, BottomSheetProps>(({ heightPercentage = 55, children }, ref) => {
    const insets = useSafeAreaInsets();
    const openHeight = hp(100) - hp(heightPercentage);
    const closeHeight = hp(100);
    const autoCloseHeight = openHeight + hp(5);
    const top = useSharedValue(hp(100));
    const context = useSharedValue(0);

    const springConfig = {
        damping: 50,
        stiffness: 400
    }

    const expand = useCallback(() => {
        'worklet';
        top.value = withTiming(openHeight);
    }, [openHeight, top]);

    const close = useCallback(() => {
        'worklet';
        top.value = withTiming(closeHeight);
    }, [closeHeight, top]);

    useImperativeHandle(
        ref,
        () => ({
            expand, close
        }),
        [expand, close]
    )

    const animatedStyle = useAnimatedStyle(() => {
        return {
            top: top.value
        }
    })

    const pan = Gesture.Pan()
        .onBegin(() => {
            context.value = top.value;
        })
        .onUpdate((event) => {
            if(event.translationY < 0) {
                top.value = withSpring(openHeight, springConfig);
            } else {
                top.value = withSpring(event.translationY + context.value, springConfig);
            }
        })
        .onEnd(() => {
            if(top.value > autoCloseHeight) {
                top.value = withSpring(closeHeight, springConfig);
            } else {
                top.value = withSpring(openHeight, springConfig);
            }
        })

    return (
        <>
            <Backdrop
                top={ top }
                openHeight={openHeight}
                closeHeight={closeHeight}
                close={ close }
            />
            <GestureDetector gesture={ pan }>
                <Animated.View style={ [styles.container, animatedStyle] }>
                    <View style={ styles.line } />
                    <View style={{ flex: 1, padding: DEFAULT_SEPARATOR }}>
                        { children }
                    </View>
                </Animated.View>
            </GestureDetector>
        </>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.black,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        // overflow: "hidden",
        zIndex: 99
    },
    line: {
        alignSelf: "center",
        marginTop: SEPARATOR_SIZES.normal,
        width: hp(15),
        height: hp(0.75),
        backgroundColor: theme.colors.white2,
        borderRadius: 35
    },
})

export default BottomSheet;