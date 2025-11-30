import { StyleSheet } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { Legend, LegendData } from "./common/Legend.tsx";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import { PointerLabel } from "./common/PointerLabel.tsx";
import { ChartTitle, ChartTitleProps } from "./common/ChartTitle.tsx";
import React from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";

const SPACING = 1.5;
const AXIS_FONT_SIZE = FONT_SIZES.p4 * 0.85;

export type BarChartItem = {
    label: string
    value: Array<number | string> | number | string
    type?: Array<string> | string
}

type BarChartViewProps = {
    chartData: Array<BarChartItem>
    title?: ChartTitleProps
    legend?: { [key: string]: LegendData }
    barWidth?: number
    formatLabel?: (label: string) => string
    formatValue?: (value: number | string) => string
    formatLegend?: (label: string) => string
    showsLegend?: boolean
}

export function BarChartView({
    chartData,
    title,
    legend,
    barWidth = 11.5,
    formatLabel,
    formatValue,
    formatLegend,
    showsLegend = true
}: BarChartViewProps) {
    const transformToBarData = (
        groups: Array<BarChartItem>,
        legend: { [key: string]: LegendData }
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

                    let frontColor = typeInfo?.color ?? "#000000";
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

                let frontColor = typeInfo?.color ?? "#000000";
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
                    barStyle: { left: labelWidth / 2 - barWidth / 2 },
                    disablePress,
                    leftShiftForTooltip: -labelWidth / 3 - barWidth / 2
                });
            }
        });

        result.push({ label: "", barWidth: 0, labelWidth: 0, spacing: 0 }); //prevent overflow

        return result;
    };

    const barData = transformToBarData(chartData, legend);
    const maxValue = Math.max(...barData.map(data => data.value ?? 0));
    const chartMaxValue = Math.round(maxValue + maxValue * 0.2);

    const formatedMaxValue = formatValue?.(chartMaxValue) ?? chartMaxValue.toString();
    const yAxisLabelWidth = AXIS_FONT_SIZE * 0.55 * (formatedMaxValue.length + 1.5 ?? 0);

    return (
        <>
            {
                title &&
               <ChartTitle { ...title } />
            }
            <BarChart
                data={ barData }
                maxValue={ chartMaxValue }
                barWidth={ barWidth }
                formatYLabel={ formatValue }
                width={ widthPercentageToDP(100) - yAxisLabelWidth }
                minHeight={ SEPARATOR_SIZES.lightSmall * 1.15 }
                disablePress
                roundedTop
                roundedBottom
                lineBehindBars
                highlightEnabled
                noOfSections={ 6 }
                rulesType="solid"
                rulesColor={ COLORS.gray4 }
                xAxisLabelTextStyle={ styles.axisLabel }
                xAxisThickness={ 0 }
                yAxisSide="right"
                yAxisLabelWidth={ yAxisLabelWidth }
                yAxisTextStyle={ styles.axisLabel }
                yAxisThickness={ 0 }
                renderTooltip={ (item) => <PointerLabel value={ formatValue?.(item.value) ?? item.value }/> }
            />
            {
                legend && showsLegend &&
               <Legend legend={ legend } formatLegend={ formatLegend }/>
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