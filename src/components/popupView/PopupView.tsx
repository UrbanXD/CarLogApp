import React, { ReactNode, useCallback, useEffect, useState } from "react";
import Animated, {
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { Dimensions, Keyboard, LayoutChangeEvent, StyleSheet } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES } from "../../constants/index.ts";
import { Overlay } from "../overlay/Overlay.tsx";
import { Portal } from "@gorhom/portal";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { ViewStyle } from "../../types/index.ts";

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

let popupCounter = 3;

export function PopupView({ opened, dismount = true, children, style }: PopupViewProps) {
    const { top } = useSafeAreaInsets();
    const { height: SCREEN_HEIGHT } = Dimensions.get("window");

    const popupDisplay = useSharedValue<"flex" | "none">("none");
    const popupHeight = useSharedValue(0);
    const keyboardHeight = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const [zIndex, setZIndex] = useState(3);
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

    useEffect(() => {
        if(!mounted) return;

        popupCounter += 2;
        setZIndex(popupCounter);
    }, [mounted]);

    useAnimatedReaction(
        () => opened.value,
        (isOpened, prev) => {
            if(isOpened === prev) return;

            if(isOpened) {
                // mount and show
                popupDisplay.value = "flex";
                scheduleOnRN(setMounted, true);

                // animate in
                opacity.value = withTiming(1, { duration: 350 });
                scale.value = withSpring(1, SPRING_CONFIG);
            } else {
                // animate out
                opacity.value = withTiming(0, { duration: 350 });
                scale.value = withSpring(1.025, SPRING_CONFIG, (finished) => {
                    if(!finished) return;

                    popupDisplay.value = "none";
                    scheduleOnRN(setMounted, false);
                });
            }
        },
        []
    );

    const close = () => opened.value = false;

    const onLayout = useCallback(
        (event: LayoutChangeEvent) => popupHeight.value = event.nativeEvent.layout.height,
        [style]
    );

    const popupStyle = useAnimatedStyle(() => {
        const baseY = SCREEN_HEIGHT / 2 - popupHeight.value / 2;
        const popupBottom = baseY + popupHeight.value;
        const keyboardTop = SCREEN_HEIGHT - keyboardHeight.value;

        const overlap = popupBottom - keyboardTop;
        const minTranslateY = DEFAULT_SEPARATOR + top;

        let positionY = baseY;
        if(overlap > 0) positionY = Math.max(minTranslateY, baseY - (overlap + 3 * DEFAULT_SEPARATOR)); // popupview padding + gap

        const translateY = withTiming(positionY, { duration: 250 });

        return {
            display: popupDisplay.value,
            opacity: opacity.value,
            transform: [{ scale: scale.value }, { translateY }],
            zIndex: zIndex
        };
    });

    return (
        <Portal hostName="popup">
            <Overlay opened={ opened } onPress={ close } zIndex={ zIndex }/>
            {
                (!dismount || mounted) &&
               <Animated.View style={ [styles.container, style, popupStyle] } onLayout={ onLayout }>
                   { children }
               </Animated.View>
            }
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: widthPercentageToDP(100) - 2 * DEFAULT_SEPARATOR,
        marginHorizontal: DEFAULT_SEPARATOR,
        backgroundColor: COLORS.black5,
        paddingHorizontal: SEPARATOR_SIZES.small,
        paddingVertical: DEFAULT_SEPARATOR,
        borderRadius: 25,
        overflow: "hidden"
    }
});