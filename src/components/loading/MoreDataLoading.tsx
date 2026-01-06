import React from "react";
import { ActivityIndicator, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Color } from "../../types/index.ts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../constants/index.ts";
import BounceDot from "./BounceDot.tsx";
import { useTranslation } from "react-i18next";

type MoreDataLoadingProps = {
    text?: string
    activityIndicatorSize?: "small" | "large" | number
    activityIndicatorColor?: Color
    containerStyle?: ViewStyle
    textStyle?: TextStyle
    withBounceDot?: boolean
}

export function MoreDataLoading({
    text,
    activityIndicatorSize = "small",
    activityIndicatorColor = COLORS.gray2,
    containerStyle,
    textStyle,
    withBounceDot = true
}: MoreDataLoadingProps) {
    const { t } = useTranslation();

    return (
        <View style={ [styles.container, containerStyle] }>
            <ActivityIndicator size={ activityIndicatorSize } color={ activityIndicatorColor }/>
            <View style={ styles.textContainer }>
                <Text style={ [styles.text, textStyle] }>{ text ?? t("common.data_loading") }</Text>
                {
                    withBounceDot &&
                   <>
                      <BounceDot delay={ 0 } style={ styles.text }/>
                      <BounceDot delay={ 200 } style={ styles.text }/>
                      <BounceDot delay={ 400 } style={ styles.text }/>
                   </>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SEPARATOR_SIZES.small,
        alignItems: "center",
        justifyContent: "center"
    },
    textContainer: {
        flexDirection: "row"
    },
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray2,
        textAlign: "center"
    }
});