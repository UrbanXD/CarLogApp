import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import { COLORS, FONT_SIZES } from "../../../../../constants/index.ts";

export type ChartTitleProps = {
    title: string
    description?: string
    containerStyle?: ViewStyle
    titleStyle?: TextStyle
    descriptionStyle?: TextStyle
}

export function ChartTitle({ title, description, containerStyle, titleStyle, descriptionStyle }: ChartTitleProps) {
    return (
        <View style={ containerStyle }>
            <Text style={ [styles.title, titleStyle] }>
                { title }
            </Text>
            {
                description &&
               <Text style={ [styles.description, descriptionStyle] }>
                   { description }
               </Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white
    },
    description: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1
    }
});