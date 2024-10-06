import React from "react";
import { ColorValue, StyleSheet, View } from "react-native";
import { DEFAULT_SEPARATOR, SIMPLE_HEADER_HEIGHT } from "../../core/constants/constants";
import Animated, { SharedValue } from "react-native-reanimated";

interface SimpleHeaderProps {
    children?: React.ReactNode | null,
    backgroundColor?: ColorValue,
    height?: SharedValue<number> | number
}

export const SimpleHeaderBar: React.FC<SimpleHeaderProps> = ({
    children,
    height = SIMPLE_HEADER_HEIGHT,
    backgroundColor = "transparent"
}) => {
    return (
        <Animated.View style={{ height, backgroundColor }}>
            <View style={ style.barContainer }>
                { children }
            </View>
        </Animated.View>
    )
}

const style = StyleSheet.create({
    barContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        paddingHorizontal: DEFAULT_SEPARATOR
    }
})