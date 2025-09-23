import React from "react";
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES } from "../constants/index.ts";
import Icon from "./Icon";

type LinkProps = {
    text?: string
    icon?: string
    onPress?: () => void
    style?: ViewStyle
    textStyle?: TextStyle
}

function Link({ text, icon, onPress, style, textStyle }: LinkProps) {
    return (
        <Pressable style={ [styles.linkContainer, style] } onPress={ onPress } disabled={ !onPress }>
            {
                text &&
               <Text style={ [styles.linkText, textStyle] }>
                   { text }
               </Text>
            }
            {
                icon &&
               <Icon
                  icon={ icon }
                  size={ styles.linkText.fontSize * 1.35 }
                  color={ styles.linkText.color }
               />
            }
        </Pressable>
    );
}

const styles = StyleSheet.create({
    linkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center"
    },
    linkText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        textAlign: "center",
        color: COLORS.fuelYellow
    }
});

export default Link;