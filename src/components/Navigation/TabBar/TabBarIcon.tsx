import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Icon from "../../Icon.tsx";
import { COLORS, SIMPLE_TABBAR_HEIGHT } from "../../../constants/index.ts";

type TabBarIconProps = {
    title: string
    iconName?: string
    iconColor?: string
    iconSize?: number
    onPress: () => void
    onLongPress: () => void
}

function TabBarIcon({
    title,
    iconName = "home",
    iconColor = COLORS.white,
    iconSize,
    onPress,
    onLongPress
}: TabBarIconProps) {
    const styles = useStyles(iconColor);

    return (
        <Pressable
            onPress={ onPress }
            onLongPress={ onLongPress }
            style={ styles.container }
        >
            <Icon
                icon={ iconName }
                size={ iconSize }
                color={ iconColor }
            />
            <Text style={ styles.title }>{ title }</Text>
        </Pressable>
    );
}

export default TabBarIcon;

const useStyles = (color: string) =>
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