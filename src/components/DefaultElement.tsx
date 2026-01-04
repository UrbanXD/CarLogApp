import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../constants/index.ts";
import Icon from "./Icon";
import { hexToRgba } from "../utils/colors/hexToRgba";
import { ImageSource } from "../types/index.ts";

type DefaultElementProps = {
    icon?: ImageSource
    text?: string
    onPress?: () => void
    style?: ViewStyle
}

function DefaultElement({
    icon = ICON_NAMES.image,
    text,
    onPress,
    style
}: DefaultElementProps) {
    return (
        <Pressable
            onPress={ onPress }
            disabled={ !onPress }
            style={ [styles.container, style] }
        >
            <View style={ { alignItems: "center" } }>
                <Icon
                    icon={ icon }
                    size={ FONT_SIZES.title }
                    color={ COLORS.gray3 }
                />
                {
                    text &&
                   <Text style={ styles.text }>{ text }</Text>
                }
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: hexToRgba(COLORS.gray5, 0.65),
        borderWidth: 0.5,
        borderRadius: 38,
        borderColor: COLORS.gray5,
        paddingHorizontal: SEPARATOR_SIZES.small,
        overflow: "hidden"
    },
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.025,
        lineHeight: FONT_SIZES.p2 * 1.25,
        color: COLORS.gray2,
        textAlign: "center"
    }
});

export default DefaultElement;