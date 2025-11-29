import { PieChart } from "react-native-gifted-charts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { ChartTitle, ChartTitleProps } from "./common/ChartTitle.tsx";
import { Legend, LegendData } from "./common/Legend.tsx";

export type DonutChartItem = {
    label: string
    description: string
    value: number | string
    color: string
}

type DonutChartViewProps = {
    chartData: Array<DonutChartItem>
    title?: ChartTitleProps
    legend?: { [key: string]: LegendData }
}

export function DonutChartView({ chartData, title, legend }: DonutChartViewProps) {
    return (
        <View style={ styles.chartContainer }>
            {
                title &&
               <ChartTitle { ...title } />
            }
            <PieChart
                data={ chartData }
                donut
                focusOnPress
                sectionAutoFocus
                radius={ 90 }
                innerRadius={ 65 }
                innerCircleColor={ COLORS.black2 }
                centerLabelComponent={ (index: number) => {
                    const focused = pieData?.[index];

                    if(!focused) return <></>;

                    return (
                        <CenterLabel
                            label={ focused.label }
                            de
                            value={ focused.value }
                        />
                    );
                } }
            />
            {
                legend &&
               <Legend legend={ legend }/>
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
        gap: SEPARATOR_SIZES.lightSmall
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