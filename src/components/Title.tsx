import { StyleSheet, Text } from "react-native";
import Divider from "./Divider.tsx";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../constants";
import React from "react";
import { TextStyle, ViewStyle } from "../types";
import { DebouncedPressable } from "./DebouncedPressable.tsx";

type TitleProps = {
    title: string
    subtitle?: string
    onPress?: () => void
    containerStyle?: ViewStyle
    titleStyle?: TextStyle
    subtitleStyle?: TextStyle
    dividerStyle?: ViewStyle
}

export function Title({
    title,
    subtitle,
    onPress,
    containerStyle,
    titleStyle,
    subtitleStyle,
    dividerStyle
}: TitleProps) {
    return (
        <DebouncedPressable
            disabled={ !onPress }
            onPress={ onPress }
            style={ [styles.container, containerStyle] }
        >
            <Text style={ [styles.title, titleStyle] }>{ title }</Text>
            {
                subtitle &&
               <Text style={ [styles.subtitle, subtitleStyle] }>{ subtitle }</Text>
            }
            <Divider
                thickness={ 5 }
                size={ widthPercentageToDP(35) }
                color={ COLORS.fuelYellow }
                margin={ SEPARATOR_SIZES.lightSmall / 2 }
                style={ [styles.divider, dividerStyle] }
            />
        </DebouncedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        lineHeight: FONT_SIZES.p1,
        color: COLORS.white
    },
    subtitle: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2,
        color: COLORS.gray1,
        textAlign: "left"
    },
    divider: {
        alignSelf: "flex-start",
        marginLeft: SEPARATOR_SIZES.mediumSmall
    }
});