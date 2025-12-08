import { StyleSheet, View } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { Legend, LegendData } from "./common/Legend.tsx";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import {
    POINTER_LABEL_FONT_SIZE,
    POINTER_LABEL_MIN_WIDTH,
    POINTER_LABEL_PADDING,
    PointerLabel
} from "./common/PointerLabel.tsx";
import { ChartTitle, ChartTitleProps } from "./common/ChartTitle.tsx";
import React from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";
import { ChartDataNotFound } from "./common/ChartDataNotFound.tsx";
import { getYAxisProps } from "../../utils/getYAxisProps.ts";

const SPACING = 1.5;
const AXIS_FONT_SIZE = FONT_SIZES.p4 * 0.85;

export type BarChartItem = {
    label: string
    value: Array<number | string> | number | string
    type?: Array<string> | string
}

type BarChartViewProps = {
    chartData?: Array<BarChartItem>
    title?: ChartTitleProps
    legend?: { [key: string]: LegendData }
    barWidth?: number
    formatLabel?: (label: string) => string
    formatValue?: (value: number | string) => string
    formatLegend?: (label: string) => string
    showsLegend?: boolean
    legendPosition?: "top" | "bottom" | "left" | "right"
    formatYLabelAsValue?: boolean
    defaultBarColor?: string
    isLoading?: boolean
}

export function BarChartView({
    chartData = [],
    title,
    legend = {},
    barWidth = 11.5,
    formatLabel,
    formatValue,
    formatLegend,
    showsLegend = true,
    legendPosition = "bottom",
    formatYLabelAsValue = true,
    defaultBarColor = COLORS.gray1,
    isLoading = false
}: BarChartViewProps) {
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
                    if(value === "" || value <= 0) {
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
                if(group.value === "" || group.value === 0) {
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
        formatLabel: (formatYLabelAsValue ? formatValue : undefined),
        fontSize: AXIS_FONT_SIZE
    });

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
                            <BarChart
                                data={ barData }
                                width={ widthPercentageToDP(100) - yAxisLabelWidth }
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
                                rulesType="solid"
                                rulesColor={ COLORS.gray4 }
                                xAxisLabelTextStyle={ styles.axisLabel }
                                xAxisThickness={ 0 }
                                yAxisSide="right"
                                yAxisLabelWidth={ yAxisLabelWidth }
                                yAxisTextStyle={ styles.axisLabel }
                                yAxisThickness={ 0 }
                                renderTooltip={ (item) => <PointerLabel
                                    value={ formatValue?.(item.value) ?? item.value }/> }
                            />
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