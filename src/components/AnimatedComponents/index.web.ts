import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { DebouncedPressable } from "../DebouncedPressable";

// Reanimated's SVG setNativeProps path passes indexed style arrays to the
// browser's CSSStyleDeclaration. Render animated SVG nodes statically on web.
function resolveInitialStyle(style: any): any {
    if(Array.isArray(style)) return style.map(resolveInitialStyle);
    if(style?.initial?.value) return style.initial.value;
    return style;
}

function createStaticSvgComponent(Component: React.ComponentType<any>) {
    return React.forwardRef<any, any>((props, ref) => {
        const { animatedProps: _animatedProps, style, ...componentProps } = props;
        return React.createElement(Component, {
            ...componentProps,
            ref,
            style: StyleSheet.flatten(resolveInitialStyle(style))
        });
    });
}

export const AnimatedSvg = createStaticSvgComponent(Svg);
export const AnimatedPath = createStaticSvgComponent(Path);
export const AnimatedCircle = createStaticSvgComponent(Circle);
export const AnimatedPressable = Animated.createAnimatedComponent(DebouncedPressable);
export const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
export const AnimatedMaterialIcon = Animated.createAnimatedComponent(MaterialIcon);
export const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as unknown as new <T>(
    props: FlashListProps<T>
) => React.Component<FlashListProps<T>>;
