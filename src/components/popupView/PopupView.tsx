import React, { ReactNode, useCallback, useEffect, useState } from "react";
import Animated, {
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { Dimensions, Keyboard, LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES } from "../../constants/index.ts";
import { Overlay } from "../overlay/Overlay.tsx";
import { Portal } from "@gorhom/portal";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PopupViewProps = {
    opened: SharedValue<boolean>
    dismount?: boolean
    children?: ReactNode
    style?: ViewStyle
}

const SPRING_CONFIG = {
    duration: 800,
    overshootClamping: true,
    dampingRatio: 0.8
};

export function PopupView({ opened, dismount = true, children, style }: PopupViewProps) {
    const { top } = useSafeAreaInsets();
    const { height: SCREEN_HEIGHT } = Dimensions.get("window");

    const popupDisplay = useSharedValue<"flex" | "none">("none");
    const popupHeight = useSharedValue(0);
    const keyboardHeight = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
            keyboardHeight.value = event.endCoordinates.height;
        });

        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            keyboardHeight.value = 0;
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useAnimatedReaction(
        () => opened.value,
        (isOpened, prev) => {
            if(isOpened === prev) return;

            if(isOpened) {
                // mount and show
                popupDisplay.value = "flex";
                scheduleOnRN(setMounted, true);

                // animate in
                opacity.value = withTiming(1, { duration: 250 });
                scale.value = withSpring(1, SPRING_CONFIG);
            } else {
                // animate out
                opacity.value = withTiming(0, { duration: 250 });
                scale.value = withSpring(1.1, SPRING_CONFIG, (finished) => {
                    if(!finished) return;

                    popupDisplay.value = "none";
                    scheduleOnRN(setMounted, false);
                });
            }
        },
        []
    );

    const close = () => opened.value = false;

    const onLayout = useCallback((event: LayoutChangeEvent) => popupHeight.value = event.nativeEvent.layout.height, []);

    const popupStyle = useAnimatedStyle(() => {
        const maxTranslateY = Math.max(0, SCREEN_HEIGHT - popupHeight.value - SEPARATOR_SIZES.normal - top);
        const translateY = withTiming(-Math.min(keyboardHeight.value, maxTranslateY) / 2, { duration: 450 });

        return {
            display: popupDisplay.value,
            height: withTiming(popupHeight.value, { duration: 250 }),
            opacity: opacity.value,
            transform: [{ scale: scale.value }, { translateY }]
        };
    });

    return (
        <Portal hostName="popup">
            <Overlay opened={ opened } onPress={ close }/>
            {
                (!dismount || mounted) &&
               <>
                  <View style={ styles.container } pointerEvents="box-none">
                     <View
                        style={ [styles.popup, style, styles.hiddenElement] }
                        onLayout={ onLayout }
                     >
                         { children }
                     </View>
                     <Animated.View style={ [popupStyle, styles.popup, style] }>
                         { children }
                     </Animated.View>
                  </View>
               </>
            }
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        zIndex: 3,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: DEFAULT_SEPARATOR
    },
    hiddenElement: {
        position: "absolute",
        opacity: 0,
        zIndex: -1
    },
    popup: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.black5,
        paddingHorizontal: SEPARATOR_SIZES.small,
        paddingVertical: DEFAULT_SEPARATOR,
        borderRadius: 25,
        overflow: "hidden"
    }
});