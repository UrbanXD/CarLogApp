import { ReactNode } from "react";
import type { SharedValue } from "react-native-reanimated";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export type AnimatedChild = {
    children: ReactNode
    index: number
    position: SharedValue<number>
    width: SharedValue<number>
    spacing: number
}

export function AnimatedChild({ children, index, position, width, spacing }: AnimatedChild) {
    const style = useAnimatedStyle(() => ({
        position: "absolute",
        width: width.value + spacing,
        alignSelf: "flex-start",
        left: index * (width.value + spacing),
        transform: [{ translateX: -(position.value % (width.value + spacing)) }]
    }));

    return (
        <Animated.View style={ style }>{ children }</Animated.View>
    );
}