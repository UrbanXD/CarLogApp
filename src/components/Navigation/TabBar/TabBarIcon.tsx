import React from "react";
import { StyleSheet } from "react-native";
import Icon from "../../Icon.tsx";
import { SIMPLE_TABBAR_HEIGHT } from "../../../constants/index.ts";
import { Color, ImageSource } from "../../../types/index.ts";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { AnimatedPressable } from "../../AnimatedComponents/index.ts";

type TabBarIconProps = {
    title: string
    isFocused: boolean
    activeIcon?: ImageSource
    inactiveIcon?: ImageSource
    iconSize: number
    activeColor: Color
    inactiveColor: Color
    onPress: () => void
    onLongPress: () => void
}

function TabBarIcon({
    title,
    isFocused,
    activeIcon = "help",
    inactiveIcon = "help",
    iconSize,
    activeColor,
    inactiveColor,
    onPress,
    onLongPress
}: TabBarIconProps) {
    const styles = useStyles(isFocused ? activeColor : inactiveColor);

    const containerStyle = useAnimatedStyle(() => {
        const scale = withTiming(isFocused ? 1.15 : 1, { duration: 150, easing: Easing.quad });

        return { transform: [{ scale }] };
    });

    return (
        <AnimatedPressable
            onPress={ onPress }
            onLongPress={ onLongPress }
            style={ [styles.container, containerStyle] }
        >
            <Icon
                icon={ isFocused ? activeIcon : inactiveIcon }
                size={ iconSize }
                color={ isFocused ? activeColor : inactiveColor }
            />
            <Animated.Text style={ styles.title }>{ title }</Animated.Text>
        </AnimatedPressable>
    );
}

export default TabBarIcon;

const useStyles = (color: Color) =>
    StyleSheet.create({
        container: {
            flex: 1,
            height: SIMPLE_TABBAR_HEIGHT,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center"
        },
        title: {
            fontFamily: "Gilroy-Medium",
            color
        }
    });