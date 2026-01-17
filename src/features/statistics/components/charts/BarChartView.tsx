import { StyleSheet, Text, View } from "react-native";
import { BarChart, barDataItem, yAxisSides } from "react-native-gifted-charts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants";
import { Legend, LegendData } from "./common/Legend.tsx";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import {
    POINTER_LABEL_FONT_SIZE,
    POINTER_LABEL_MIN_WIDTH,
    POINTER_LABEL_PADDING,
    PointerLabel
} from "./common/PointerLabel.tsx";
import { ChartTitle, ChartTitleProps } from "./common/ChartTitle.tsx";
import React, { useState } from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";
import { ChartDataNotFound } from "./common/ChartDataNotFound.tsx";
import { getYAxisProps } from "../../utils/getYAxisProps.ts";

const CHART_HEIGHT = 225;
const SPACING = 1.5;
const AXIS_FONT_SIZE = FONT_SIZES.p4 * 0.85;
const AXIS_TITLE_FONT_SIZE = AXIS_FONT_SIZE * 1.2;

export type BarChartItem = {
    label: string
    value: Array<number> | number
    type?: Array<string> | string
}

type BarChartViewProps = {
    chartData?: Array<BarChartItem>
    title?: ChartTitleProps
    legend?: { [key: string]: LegendData }
    yAxisTitle?: string
    xAxisTitle?: string
    barWidth?: number
    formatLabel?: (label: string) => string
    formatValue?: (value: number | string) => string
    formatLegend?: (label: string) => string
    showsLegend?: boolean
    legendPosition?: "top" | "bottom" | "left" | "right"
    formatYAxisLabelAsValue?: boolean
    defaultBarColor?: string
    isLoading?: boolean
}

export function BarChartView({
    chartData = [],
    title,
    legend = {},
    barWidth = 11.5,
    yAxisTitle,
    xAxisTitle,
    formatLabel,
    formatValue,
    formatLegend,
    showsLegend = true,
    legendPosition = "bottom",
    formatYAxisLabelAsValue = false,
    defaultBarColor = COLORS.gray1,
    isLoading = false
}: BarChartViewProps) {
    const [yAxisTitleLines, setYAxisTitleLines] = useState(1);

    const transformToBarData = (
        groups: Array<BarChartItem>,
        legend?: { [key: string]: LegendData }
    ): Array<barDataItem> => {
        const result: Array<barDataItem> = [];

        groups.forEach((group) => {
            const formatedLabel = formatLabel?.(group.label) ?? group.label;
            const count = Array.isArray(group.value) ? group.value.length : 1;

            const totalBarsWidth = barWidth * count + Math.max(0, SPACING * (count - 1));

            const labelWidth = Math.max(
                totalBarsWidth,
                AXIS_FONT_SIZE * 0.55 * (formatedLabel.length ?? 0)
            );

            const spacingBetweenStackedBars = labelWidth - totalBarsWidth * 0.85 +
                (labelWidth > totalBarsWidth ? SEPARATOR_SIZES.lightSmall : SEPARATOR_SIZES.normal);

            const startLeft = -labelWidth / count / 2;

            if(Array.isArray(group.value)) {
                group.value.forEach((value, index, array) => {
                    const isFirst = index === 0;
                    const isLast = index === array.length - 1;

                    const typeKey = Array.isArray(group.type) ? group.type?.[index] : group.type;
                    const typeInfo = typeKey ? legend?.[typeKey] : undefined;

                    let frontColor = typeInfo?.color ?? defaultBarColor ?? "#000000";
                    let disablePress = false;
                    if(value <= 0) {
                        frontColor = hexToRgba(frontColor, 0.3);
                        disablePress = true;
                    }

                    result.push({
                        value: value,
                        label: isFirst ? formatedLabel : undefined,
                        spacing: isLast ? spacingBetweenStackedBars : SPACING,
                        labelWidth: isFirst ? labelWidth : undefined,
                        frontColor,
                        barStyle: { left: startLeft + index * SPACING },
                        disablePress,
                        leftShiftForTooltip: -startLeft - barWidth / 2 + (array.length - 1 - index) * SPACING
                    });
                });
            } else {
                const typeKey = Array.isArray(group.type) ? group.type?.[0] : group.type;
                const typeInfo = typeKey ? legend?.[typeKey] : undefined;

                let frontColor = typeInfo?.color ?? defaultBarColor ?? "#000000";
                let disablePress = false;
                if(group.value === 0) {
                    frontColor = hexToRgba(frontColor, 0.35);
                    disablePress = true;
                }

                result.push({
                    value: group.value,
                    label: formatedLabel,
                    spacing: labelWidth + SPACING,
                    labelWidth: labelWidth,
                    frontColor,
                    barStyle: { left: (labelWidth + SPACING) / 2 - barWidth / 2 },
                    disablePress,
                    leftShiftForTooltip: barWidth - (labelWidth - SPACING * 2) / 2
                });
            }
        });

        result.push({ label: "", barWidth: 0, labelWidth: 0, spacing: 0 }); //prevent overflow

        return result;
    };

    const barData = transformToBarData(chartData, legend);
    const maxValue = Math.max(...barData.map(data => data.value ?? 0));

    const maxLabelWidth = Math.max(
        ...barData.map(item => AXIS_FONT_SIZE * 0.55 * (item.label?.length ?? 0))
    );

    const firstPointerLabelWidth = 2 * POINTER_LABEL_PADDING + POINTER_LABEL_FONT_SIZE * 0.55 * ((barData?.[0]?.value?.toString() ?? "").length + 1.5);
    const lastPointerLabelWidth = 2 * POINTER_LABEL_PADDING + POINTER_LABEL_FONT_SIZE * 0.55 * ((barData?.[barData.length - 2]?.value?.toString() ?? "").length + 1.5);

    const initialSpacing = Math.max(maxLabelWidth, firstPointerLabelWidth, POINTER_LABEL_MIN_WIDTH) / 2;
    const endSpacing = Math.max(maxLabelWidth, lastPointerLabelWidth, POINTER_LABEL_MIN_WIDTH) / 2;

    const {
        chartMaxValue,
        yAxisLabelWidth,
        showFractionalValues,
        precision,
        steps,
        formatYLabel
    } = getYAxisProps({
        maxValue,
        formatLabel: (formatYAxisLabelAsValue ? formatValue : undefined),
        fontSize: AXIS_FONT_SIZE
    });

    let flexDirection;
    switch(legendPosition) {
        case "top":
            flexDirection = "column-reverse" as const;
            break;
        case "bottom":
            flexDirection = "column" as const;
            break;
        case "left":
            flexDirection = "row-reverse" as const;
            break;
        case "right":
            flexDirection = "row" as const;
            break;
        default:
            flexDirection = "column" as const;
    }

    return (
        <>
            {
                title &&
               <ChartTitle { ...title } />
            }
            {
                isLoading
                ? <MoreDataLoading/>
                : (
                    (!barData || barData.length <= 1) // 1 because of default one
                    ? <ChartDataNotFound/>
                    : (
                        <View style={ { flexDirection, gap: SEPARATOR_SIZES.lightSmall } }>
                            <View style={ styles.container }>
                                {
                                    yAxisTitle &&
                                   <View style={ [
                                       styles.yAxisTitleWrapper, { width: AXIS_TITLE_FONT_SIZE * yAxisTitleLines }
                                   ] }>
                                      <Text style={ [styles.axisTitle, styles.yAxisTitle] }>{ yAxisTitle }</Text>
                                   </View>
                                }
                                <View style={ styles.containerWithXAxisTitle }>
                                    <BarChart
                                        data={ barData }
                                        width={
                                            widthPercentageToDP(100)
                                            - yAxisLabelWidth
                                            - (yAxisTitle ? AXIS_TITLE_FONT_SIZE * yAxisTitleLines : 0)
                                        }
                                        height={ CHART_HEIGHT }
                                        maxValue={ chartMaxValue }
                                        barWidth={ barWidth }
                                        minHeight={ SEPARATOR_SIZES.lightSmall * 1.15 }
                                        initialSpacing={ initialSpacing }
                                        endSpacing={ endSpacing }
                                        disablePress
                                        roundedTop
                                        roundedBottom
                                        lineBehindBars
                                        highlightEnabled
                                        formatYLabel={ formatYLabel }
                                        showFractionalValues={ showFractionalValues }
                                        roundToDigits={ precision }
                                        noOfSections={ steps }
                                        rulesType="dashed"
                                        rulesColor={ COLORS.gray4 }
                                        xAxisLabelTextStyle={ styles.axisLabel }
                                        xAxisThickness={ 0 }
                                        yAxisSide={ yAxisSides.LEFT }
                                        yAxisLabelWidth={ yAxisLabelWidth }
                                        yAxisTextStyle={ styles.axisLabel }
                                        yAxisThickness={ 0 }
                                        renderTooltip={
                                            (item: barDataItem) => {
                                                if(!item.value) return null;
                                                return (
                                                    <PointerLabel
                                                        value={ formatValue?.(item.value) ?? item.value.toString() }
                                                    />
                                                );
                                            }
                                        }
                                    />
                                    {
                                        xAxisTitle &&
                                       <Text style={ styles.axisTitle }>{ xAxisTitle }</Text>
                                    }
                                </View>
                            </View>
                            {
                                showsLegend && legend && Object.keys(legend).length > 0 &&
                               <View style={ { flex: 0.85, alignItems: "center", justifyContent: "center" } }>
                                  <Legend legend={ legend } formatLegend={ formatLegend }/>
                               </View> }
                        </View>
                    )
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        alignItems: "center"
    },
    containerWithXAxisTitle: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    yAxisTitleWrapper: {
        width: AXIS_TITLE_FONT_SIZE,
        justifyContent: "center",
        alignItems: "center",
        transform: [{ translateY: "-50%" }]
    },
    axisTitle: {
        fontFamily: "Gilroy-Medium",
        fontWeight: "bold",
        fontSize: AXIS_TITLE_FONT_SIZE,
        color: COLORS.gray1,
        textAlign: "center"
    },
    yAxisTitle: {
        width: CHART_HEIGHT,
        transform: [{ rotateZ: "-90deg" }]
    },
    axisLabel: {
        fontFamily: "Gilroy-Medium",
        fontSize: AXIS_FONT_SIZE,
        color: COLORS.gray1,
        textAlign: "center",
        alignSelf: "center"
    },
    legendContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
});