import React, { ReactNode, useEffect } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet, ViewStyle } from "react-native";
import { COLORS, SEPARATOR_SIZES } from "../../constants/index.ts";

type DropdownViewProps = {
    children?: ReactNode
    height: number
    expanded: boolean
    paddingVertical?: number
    style?: ViewStyle
}

function DropdownView({ children, height, expanded, paddingVertical = 0, style }: DropdownViewProps) {
    const display = useSharedValue(expanded ? 1 : 0);
    const displayAnimationConfig = { duration: 350, easing: Easing.out(Easing.ease) };

    useEffect(() => {
        display.value = withTiming(expanded ? 1 : 0, displayAnimationConfig);
    }, [expanded]);

    const dropdownViewStyle = useAnimatedStyle(() => ({
        height: display.value * height,
        opacity: display.value,
        paddingVertical: display.value * paddingVertical
    }));

    return (
        <Animated.View style={ [dropdownViewStyle, style, styles.container] }>
            { children }
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.01,
        overflow: "hidden",
        backgroundColor: COLORS.gray5,
        marginHorizontal: SEPARATOR_SIZES.mediumSmall,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    }
});

export default DropdownView;