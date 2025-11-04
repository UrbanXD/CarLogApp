import { AnimatedPressable } from "../AnimatedComponents/index.ts";
import { Color } from "../../types/index.ts";
import { COLORS } from "../../constants/index.ts";
import {
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { StyleSheet } from "react-native";

type OverlayProps = {
    opened?: SharedValue<boolean>
    color?: Color
    opacity?: number
    zIndex?: number
    onPress?: () => void
}

export function Overlay({ opened, color = COLORS.black, opacity = 0.525, zIndex = 2, onPress }: OverlayProps) {
    const overlayDisplay = useSharedValue<"flex" | "none">("none");

    useAnimatedReaction(
        () => opened?.value,
        (isOpened) => {
            if(isOpened || isOpened === undefined) overlayDisplay.value = "flex";
        }
    );

    const overlayStyle = useAnimatedStyle(() => {
        let overlayOpacity = opacity;


        if(opened?.value !== undefined) {
            overlayOpacity = withTiming(
                opened.value ? opacity : 0,
                { duration: 400 },
                (finished) => {
                    if(finished && !opened.value) overlayDisplay.value = "none";
                }
            );
        }

        return {
            display: overlayDisplay.value,
            zIndex: zIndex,
            opacity: overlayOpacity,
            backgroundColor: color
        };
    });

    return (
        <AnimatedPressable
            style={ [overlayStyle, StyleSheet.absoluteFillObject] }
            onPress={ onPress }
            disabled={ !onPress }
        />
    );
}