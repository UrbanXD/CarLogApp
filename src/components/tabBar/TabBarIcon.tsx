import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { FONT_SIZES } from "../../constants/constants";

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

const TabBarIcon: React.FC<TabBarIconProp> = ({
    title = "",
    textColor,
    focused,
    focusedColor = "#00000",
    iconName = "home",
    iconColor = textColor,
    iconSize = 28,
    onPress,
    onLongPress,
    width
}) => {
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


    const animatedIconSizeStyle = useAnimatedStyle(() => {
        const sizeValue = interpolate(
            icon.value,
            [0, 1],
            [1, 1.5]
        )

        return {
            transform: [{
                scale: sizeValue,
            }],
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center"
        }
    })

    const styles = useStyles(focused, width, textColor);

    return (
        <Pressable
            onPress={ onPress }
            onLongPress={ onLongPress }
            style={ styles.iconContainer }
        >
            <Animated.View style={ animatedIconSizeStyle }>
                <Icon size={ iconSize } source={ iconName } color={ iconColor } />
                {
                    <Animated.Text style={ styles.iconText }>
                        { title }
                    </Animated.Text>
                }
            </Animated.View>
        </Pressable>
    )
}

export default TabBarIcon;

const useStyles = (focused: boolean, iconWidth: number, textColor: string,) =>
    StyleSheet.create({
        iconContainer: {
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: iconWidth
        },
        iconText: {
            color: textColor,
            textAlign: "center",
            fontFamily:"Gilroy-Medium",
            fontSize: FONT_SIZES.extraSmall * 0.9,
            display: focused ? "none" : "flex"
        }
    })