import React, { ReactNode, useCallback, useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";

type DropdownViewProps = {
    children?: ReactNode
    expanded: boolean
    minHeight?: number
    maxHeight?: number
    style?: ViewStyle
}

const SPRING_CONFIG = {
    duration: 500,
    overshootClamping: true,
    dampingRatio: 0.8
};

export function DropdownView({ children, minHeight = 0, maxHeight, expanded, style }: DropdownViewProps) {
    const display = useSharedValue(expanded ? 1 : 0);
    const contentHeight = useSharedValue(0);

    useEffect(() => {
        display.value = withSpring(expanded ? 1 : 0, SPRING_CONFIG);
    }, [expanded]);

    const onContentLayout = useCallback((event: LayoutChangeEvent) => {
        contentHeight.value = Math.max(
            minHeight,
            Math.min(maxHeight ?? Number.MAX_SAFE_INTEGER, event.nativeEvent.layout.height)
        );
    }, []);

    const dropdownViewStyle = useAnimatedStyle(() => {
        const height = withSpring(expanded ? contentHeight.value : 0, SPRING_CONFIG);
        const opacity = withTiming(expanded ? 1 : 0.5, { duration: SPRING_CONFIG.duration / 1.5 });

        return ({
            height,
            opacity,
            overflow: "hidden"
        });
    });

    return (
        <Animated.View style={ dropdownViewStyle }>
            <View style={ [styles.container, style] } onLayout={ onContentLayout }>
                { children }
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%"
    }
});