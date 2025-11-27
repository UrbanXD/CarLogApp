import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import dayjs from "dayjs";

type ChartCardProps = {
    renderChart: () => ReactNode
    title: string
    dateRange: {
        from: string
        to: string
        openDateRangePicker: () => void
    }
}

export function ChartCard({ renderChart, title, dateRange }: ChartCardProps) {
    return (
        <View style={ styles.container }>
            <View>
                <Text style={ styles.title }>
                    { title }
                </Text>
                <Pressable onPress={ dateRange.openDateRangePicker }>
                    <View style={ styles.rangeContainer }>
                        <Text style={ styles.rangeText }>
                            { dayjs(dateRange.from).format("LL") }
                        </Text>
                        <Text style={ styles.arrow }>→</Text>
                        <Text style={ styles.rangeText }>
                            { dayjs(dateRange.to).format("LL") }
                        </Text>
                    </View>
                    <Text style={ styles.agoText }>
                        { dayjs(dateRange.from).from(dayjs(dateRange.to)) }
                    </Text>
                </Pressable>
            </View>
            { renderChart() }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall,
        borderRadius: 12
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white
    },
    rangeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 2
    },
    rangeText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1
    },
    arrow: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray2
    },
    agoText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4 * 0.85,
        color: COLORS.gray1
    }
});