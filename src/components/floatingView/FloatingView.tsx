import React, { ReactNode, useRef } from "react";
import Animated, {
    AnimatedRef,
    Easing,
    interpolate,
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { ViewStyle } from "react-native";

type FloatingViewProps = {
    ref?: AnimatedRef<Animated.View>
    children?: ReactNode
    scrollY?: SharedValue<number>
    hiddenOnScroll?: boolean
    hideAnimationThresholdY?: number
    hideAnimationDirection?: "up" | "down" | "left" | "right",
    hideAnimationDistance?: number
    top?: number
    bottom?: number
    left?: number
    right?: number
    style?: ViewStyle
}

function FloatingView({
    ref,
    children,
    scrollY,
    hiddenOnScroll = false,
    hideAnimationThresholdY = 0,
    hideAnimationDirection,
    hideAnimationDistance,
    top,
    bottom,
    right,
    left,
    style
}: FloatingViewProps) {
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const display = useSharedValue(1);
    const displayAnimationConfig = { duration: 500, easing: Easing.inOut(Easing.quad) };

    useAnimatedReaction(
        () => scrollY?.value,
        (currentY) => {
            if(!currentY || !hiddenOnScroll) return;

            if(currentY > hideAnimationThresholdY) {
                display.value = withTiming(0, displayAnimationConfig);
            } else {
                display.value = 1;
            }

            if(scrollTimeout.current) clearTimeout(scrollTimeout.current);

            scrollTimeout.current = setTimeout(() => {
                if(currentY <= hideAnimationThresholdY) return;

                display.value = withTiming(1, displayAnimationConfig);
            }, 500);
        }
    );

    const floatingViewStyle = useAnimatedStyle(() => {
        let opacity = display.value;
        const transform = [];

        if(hiddenOnScroll) {
            opacity = display.value;
            switch(hideAnimationDirection) {
                case "up":
                    transform.push({ translateY: interpolate(display.value, [0, 1], [-hideAnimationDistance, 0]) });
                    break;
                case "down":
                    transform.push({ translateY: interpolate(display.value, [0, 1], [hideAnimationDistance, 0]) });
                    break;
                case "left":
                    transform.push({ translateX: interpolate(display.value, [0, 1], [-hideAnimationDistance, 0]) });
                    break;
                case "right":
                    transform.push({ translateY: interpolate(display.value, [0, 1], [hideAnimationDistance, 0]) });
                    break;
            }
        }

        return ({
            position: "absolute",
            top,
            bottom,
            left,
            right,
            zIndex: 1,
            opacity,
            transform
        });
    });

    return (
        <Animated.View ref={ ref } style={ [floatingViewStyle, style] }>
            { children }
        </Animated.View>
    );
}

export default FloatingView;