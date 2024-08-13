import React from "react";
import {ColorValue, Image, ImageSourcePropType, StyleSheet, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {DEFAULT_SEPARATOR, SIMPLE_HEADER_HEIGHT} from "../../constants/constants";
import Animated, {SharedValue} from "react-native-reanimated";
import hexToRgba from "hex-to-rgba";
import {theme} from "../../constants/theme";
import {LinearGradient} from "expo-linear-gradient";

interface SimpleHeaderProps {
    children?: React.ReactNode | null,
    backgroundColor?: ColorValue,
    height?: SharedValue<number> | number
}

export const SimpleHeaderBar: React.FC<SimpleHeaderProps> = ({ children, height = SIMPLE_HEADER_HEIGHT, backgroundColor = "transparent" }) => {
    return (
        <Animated.View style={{ height, backgroundColor }}>
            <View style={ style.barContainer }>
                { children }
            </View>
        </Animated.View>
    )
}

interface CollapsibleHeaderProps {
    children?: React.ReactNode | null,
    backgroundColor?: ColorValue,
    height: SharedValue<number> | number,
    image: ImageSourcePropType,
    imageHeight: SharedValue<number>
    gradientColors?: Array<string>
}

export const CollapsibleHeaderBar: React.FC<CollapsibleHeaderProps> = ({ children, backgroundColor = "transparent", height, image, imageHeight, gradientColors = [] }) => {
    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

    return (
        <Animated.View style={{ backgroundColor, height }}>
            <Animated.Image
                source={ image }
                style={{ width: "100%", height: imageHeight }}
            />
            <AnimatedLinearGradient
                locations={[ 0.05, 0.5, 0.9 ]}
                colors={ gradientColors }
                style={{ ...StyleSheet.absoluteFillObject, top: 10, height: imageHeight }}
            />
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
        // justifyContent: "center",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        paddingHorizontal: DEFAULT_SEPARATOR
    }
})