import React, { ReactNode } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";

export type StatCardProps = {
    label: ReactNode
    value: ReactNode
    trend?: string
    trendDescription?: string
    description?: string
    isPositive?: boolean
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
    isPositive,
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
                <Text style={ [styles.value, valueStyle] }>{ value }</Text>
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
        paddingVertical: SEPARATOR_SIZES.lightSmall,
        paddingHorizontal: SEPARATOR_SIZES.small,
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
        color: COLORS.gray1
    },
    value: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2 * 1.25,
        color: COLORS.white
    },
    trend: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4 * 0.9,
        lineHeight: FONT_SIZES.p4 * 0.9 * 1.25,
        marginTop: SEPARATOR_SIZES.small
    },
    trendDescription: {
        fontSize: FONT_SIZES.p4 * 0.825,
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