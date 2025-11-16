import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";

export type StatCardProps = {
    label: string
    value: string
    trend?: string
    isPositive?: boolean
}

export function StatCard({ label, value, trend, isPositive }: StatCardProps) {
    const trendColor = trend
                       ? isPositive === true
                         ? COLORS.greenLight
                         : isPositive === false
                           ? COLORS.redLight
                           : COLORS.gray1
                       : COLORS.gray1;

    return (
        <View style={ styles.container }>
            <View>
                <Text style={ styles.label }>{ label }</Text>
                <Text style={ styles.value }>{ value }</Text>
            </View>
            {
                trend &&
               <Text style={ [styles.trend, { color: trendColor }] }>
                   { trend }
               </Text>
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
        color: COLORS.gray1
    },
    value: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        color: COLORS.white
    },
    trend: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4 * 0.9,
        lineHeight: FONT_SIZES.p4 * 0.9 * 1.25,
        marginTop: SEPARATOR_SIZES.small
    }
});