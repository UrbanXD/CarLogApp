import React, { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants";
import { TextStyle, ViewStyle } from "../../../types/index.ts";

export type StatCardProps = {
    label: ReactNode
    value: ReactNode | null
    trend?: string | null
    trendDescription?: string | null
    description?: string | null
    emptyValueText?: string | null
    isPositive?: boolean
    isLoading?: boolean
    containerStyle?: ViewStyle
    labelStyle?: TextStyle
    valueStyle?: TextStyle
    trendStyle?: TextStyle
    descriptionStyle?: TextStyle
}

export function StatCard({
    label,
    value,
    trend,
    trendDescription,
    description,
    emptyValueText = "-",
    isPositive,
    isLoading = false,
    containerStyle,
    labelStyle,
    valueStyle,
    trendStyle,
    descriptionStyle
}: StatCardProps) {
    const trendColor = trend
                       ? isPositive === true
                         ? COLORS.greenLight
                         : isPositive === false
                           ? COLORS.redLight
                           : COLORS.gray1
                       : COLORS.gray1;

    return (
        <View style={ [styles.container, containerStyle] }>
            <View>
                <Text style={ [styles.label, labelStyle] }>{ label }</Text>
                {
                    !isLoading
                    ? <Text style={ [styles.value, valueStyle] }>{ value ?? emptyValueText }</Text>
                    : <ActivityIndicator size={ "small" } color={ COLORS.gray2 } style={ { alignSelf: "flex-start" } }/>
                }
            </View>
            {
                trend &&
               <View>
                  <Text style={ [styles.trend, trendStyle, { color: trendColor }] }>
                      { trend }
                  </Text>
                   {
                       trendDescription &&
                      <Text
                         style={ [
                             styles.trend,
                             styles.trendDescription,
                             trendStyle,
                             { color: trendColor }
                         ] }
                      >
                          { trendDescription }
                      </Text>
                   }
               </View>
            }
            {
                description &&
               <Text style={ [styles.description, descriptionStyle] }>{ description }</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        padding: SEPARATOR_SIZES.small,
        borderRadius: 12,
        backgroundColor: COLORS.gray5,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 12
        },
        shadowOpacity: 0.58,
        shadowRadius: 16,
        elevation: 24
    },
    label: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4 * 0.9,
        lineHeight: FONT_SIZES.p4 * 0.9 * 1.25,
        letterSpacing: FONT_SIZES.p4 * 0.9 * 0.025,
        color: COLORS.gray1
    },
    value: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2 * 1.25,
        letterSpacing: FONT_SIZES.p2 * 1.25 * 0.01,
        color: COLORS.white
    },
    trend: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4 * 0.9,
        lineHeight: FONT_SIZES.p4 * 0.9 * 1.25,
        // letterSpacing: FONT_SIZES.p4 * 0.9 * 0.05,
        marginTop: SEPARATOR_SIZES.small
    },
    trendDescription: {
        fontSize: FONT_SIZES.p4 * 0.825,
        lineHeight: FONT_SIZES.p4 * 0.825 * 1.25,
        // letterSpacing: FONT_SIZES.p4 * 0.825 * 0.05,
        marginTop: 0
    },
    description: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        lineHeight: FONT_SIZES.p4 * 1.25,
        color: COLORS.gray1,
        marginTop: SEPARATOR_SIZES.lightSmall
    }
});