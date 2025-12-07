import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import React from "react";
import { COLORS, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../../../constants/index.ts";

export type ChartTitleProps = {
    title: string
    unit?: string
    description?: string
    containerStyle?: ViewStyle
    titleStyle?: TextStyle
    unitStyle?: TextStyle
    descriptionStyle?: TextStyle
}

export function ChartTitle({
    title,
    unit,
    description,
    containerStyle,
    titleStyle,
    unitStyle,
    descriptionStyle
}: ChartTitleProps) {
    return (
        <View style={ containerStyle }>
            <View style={ styles.titleContainer }>
                <Text style={ [styles.title, titleStyle] }>
                    { title }
                </Text>
                {
                    unit &&
                   <Text style={ [styles.unit, unitStyle] }>
                      ({ unit })
                   </Text>
                }
            </View>
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
    titleContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        columnGap: SEPARATOR_SIZES.lightSmall / 2,
        flexWrap: "wrap"
    },
    title: GLOBAL_STYLE.containerTitleText,
    unit: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        lineHeight: GLOBAL_STYLE.containerTitleText.fontSize,
        color: COLORS.gray1
    },
    description: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1
    }
});