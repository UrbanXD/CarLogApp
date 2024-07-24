import React, {useEffect, useState} from "react";
import {Pressable, Text, View} from "react-native";
import {TabbarIconProp} from "./TabbarIcon.prop";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Icon} from "react-native-paper";
import {LinearGradient} from "expo-linear-gradient";
import {transparent} from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import {BlurView} from "expo-blur";
import hexToRgba from "hex-to-rgba";
import {theme} from "../../styles/theme";
import Animated, {
    interpolate,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue, withDelay,
    withSpring, withTiming
} from "react-native-reanimated";
import * as Animatable from 'react-native-animatable';

const TabbarIcon: React.FC<TabbarIconProp> = ({title= "", textColor, focused, focusedColor= "#00000", iconName="home", iconColor = textColor, iconSize = 28, onPress, onLongPress, width }) => {
    const scale = useSharedValue(0);
    const icon = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(
            focused ? 1 : 0,
            { duration: 2000 }
        )
    }, [focused, scale]);

    useEffect(() => {
        icon.value = withSpring(
            focused ? 1 : 0,
            { duration: 1500 }
        )
    }, [focused, icon]);

    const animatedIconTextStyle = useAnimatedStyle(() => {
        const opacityValue = interpolate(
            icon.value,
            [0, 0.1, 1],
            [1, 0.05, 0]
        )
        return {
            opacity: opacityValue,
            color: textColor,
        }
    })

    const animatedIconSizeStyle = useAnimatedStyle(() => {
        const sizeValue = interpolate(
            icon.value,
            [0, 1],
            [1, 1.5]
        )

        return {
            transform: [{
                scale: sizeValue,
            }, {
                translateY: focused ? 10 : 0
            }],
            alignItems: "center",
            alignSelf: "center"
        }
    })

    return (
        <Pressable
            onPress={ onPress }
            onLongPress={ onLongPress }
            style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: width,
                // backgroundColor: "red"
            }}
        >
            <Animated.View style={ animatedIconSizeStyle }>
                <Icon size={ iconSize } source={ iconName } color={ iconColor } />
                {
                    <Animated.Text style={ animatedIconTextStyle }>{ title }</Animated.Text>
                }
            </Animated.View>
        </Pressable>
    )
}

export default TabbarIcon;