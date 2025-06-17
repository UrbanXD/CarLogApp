import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import Icon from "../../../../components/Icon";
import { COLORS } from "../../../../constants/index.ts";

interface TabBarIconProp {
    focused: boolean
    iconName?: string
    iconColor?: string,
    iconSize?: number,
    onPress: () => void
    onLongPress: () => void,
    width: number
}

const TabBarIcon: React.FC<TabBarIconProp> = ({
    focused,
    iconName = "home",
    iconColor = COLORS.white,
    iconSize,
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

    const styles = useStyles(width);

    return (
        <Pressable
            onPress={ onPress }
            onLongPress={ onLongPress }
            style={ styles.iconContainer }
        >
            <Animated.View style={ animatedIconSizeStyle }>
                <Icon
                    icon={ iconName }
                    size={ iconSize }
                    color={ iconColor }
                />
            </Animated.View>
        </Pressable>
    )
}

export default TabBarIcon;

const useStyles = (iconWidth: number) =>
    StyleSheet.create({
        iconContainer: {
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: iconWidth
        }
    })