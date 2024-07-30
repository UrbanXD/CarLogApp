import React, {useEffect} from "react";
import {Pressable} from "react-native";
import {Icon} from "react-native-paper";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface TabBarIconProp {
    title?: string
    textColor: string
    focused: boolean
    focusedColor?: string
    iconName?: string
    iconColor?: string,
    iconSize?: number,
    onPress: () => void
    onLongPress: () => void,
    width: number
}

const TabBarIcon: React.FC<TabBarIconProp> = ({title= "", textColor, focused, focusedColor= "#00000", iconName="home", iconColor = textColor, iconSize = 28, onPress, onLongPress, width }) => {
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

export default TabBarIcon;