import { PieChart } from "react-native-gifted-charts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { ChartTitle, ChartTitleProps } from "./common/ChartTitle.tsx";
import { Legend, LegendData } from "./common/Legend.tsx";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";
import { ChartDataNotFound } from "./common/ChartDataNotFound.tsx";

export type DonutChartItem = {
    label: string
    description?: string
    value: number | string
    color: string
    focused?: boolean
}

type DonutChartViewProps = {
    chartData?: Array<DonutChartItem>
    title?: ChartTitleProps
    legend?: { [key: string]: LegendData }
    formatLabel?: (label: string) => string
    formatDescription?: (description: string) => string
    formatLegend?: (label: string) => string,
    showsLegend?: boolean
    legendPosition?: "top" | "bottom" | "left" | "right"
    isLoading?: boolean
}

export function DonutChartView({
    chartData = [],
    title,
    legend = {},
    formatLabel,
    formatDescription,
    formatLegend,
    showsLegend = true,
    legendPosition = "bottom",
    isLoading = false
}: DonutChartViewProps) {
    let flexDirection;
    switch(legendPosition) {
        case "top":
            flexDirection = "column-reverse";
            break;
        case "bottom":
            flexDirection = "column";
            break;
        case "left":
            flexDirection = "row-reverse";
            break;
        case "right":
            flexDirection = "row";
            break;
        default:
            flexDirection = "column";
    }

    return (
        <View style={ [styles.chartContainer] }>
            {
                title &&
               <ChartTitle { ...title } containerStyle={ { alignSelf: "flex-start" } }/>
            }
            {
                isLoading
                ? <MoreDataLoading/>
                : (
                    (!chartData || chartData.length === 0)
                    ? <ChartDataNotFound/>
                    : (
                        <View style={ { flexDirection, gap: SEPARATOR_SIZES.lightSmall } }>
                            <PieChart
                                data={ chartData }
                                donut
                                isAnimated
                                animationDuration={ 750 }
                                focusOnPress
                                sectionAutoFocus
                                radius={ 90 }
                                innerRadius={ 65 }
                                innerCircleColor={ COLORS.black2 }
                                centerLabelComponent={ (index: number) => {
                                    const focused = chartData?.[index];

                                    if(!focused) return <></>;

                                    return (
                                        <CenterLabel
                                            label={ focused.label && (formatLabel?.(focused.label) ?? focused.label) }
                                            description={ focused.description && (formatDescription?.(focused.description) ?? focused.description) }
                                            value={ focused.value }
                                        />
                                    );
                                } }
                            />
                            {
                                showsLegend && legend &&
                               <View style={ { flex: 0.85, alignItems: "center", justifyContent: "center" } }>
                                  <Legend legend={ legend } formatLegend={ formatLegend }/>
                               </View>
                            }
                        </View>
                    )
                )
            }
        </View>
    );
}

export function CenterLabel({ label, description, value }: {
    label?: string,
    description?: string,
    value: number | string
}) {
    return (
        <View style={ styles.labelContainer }>
            <Text style={ styles.value }>
                { value }%
            </Text>
            {
                label &&
               <Text style={ styles.label }>{ label }</Text>
            }
            {
                description &&
               <Text style={ [styles.label, styles.description] }>
                   { description }
               </Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    chartContainer: {
        gap: SEPARATOR_SIZES.lightSmall,
        alignItems: "center",
        justifyContent: "center"
    },
    labelContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        paddingHorizontal: 10,
        borderRadius: 100
    },
    value: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center",
        marginBottom: SEPARATOR_SIZES.lightSmall / 4
    },
    label: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        letterSpacing: FONT_SIZES.p4 * 0.035,
        color: COLORS.gray1,
        textAlign: "center"
    },
    description: {
        fontSize: FONT_SIZES.p4 * 0.85
    }
});