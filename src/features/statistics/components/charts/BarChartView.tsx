import { StyleSheet } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { Legend, LegendData } from "./common/Legend.tsx";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import { PointerLabel } from "./common/PointerLabel.tsx";
import { ChartTitle, ChartTitleProps } from "./common/ChartTitle.tsx";
import React from "react";

const SPACING = 1.5;
const X_AXIS_FONT_SIZE = FONT_SIZES.p4 * 0.85;

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
}

export function BarChartView({
    chartData,
    title,
    legend,
    barWidth = 11.5,
    formatLabel,
    formatValue
}: BarChartViewProps) {
    const transformToBarData = (
        groups: Array<BarChartItem>,
        legend: { [key: string]: LegendData }
    ): Array<BarDataItem> => {
        const result: Array<barDataItem> = [];

        groups.forEach((group) => {
            const count = Array.isArray(group.value) ? group.value.length : 1;

            const totalBarsWidth = barWidth * count + Math.max(0, SPACING * (count - 1));

            const labelWidth = Math.max(
                totalBarsWidth,
                X_AXIS_FONT_SIZE * 0.55 * (group.label.length ?? 0)
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
                    if(value === "" || value === 0) {
                        frontColor = hexToRgba(frontColor, 0.35);
                        disablePress = true;
                    }

                    result.push({
                        value: formatValue ? formatValue(value) : value,
                        label: isFirst ? (formatLabel ? formatLabel(group.label) : group.label) : undefined,
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
                    value: formatValue ? formatValue(group.value) : group.value,
                    label: formatLabel ? formatLabel(group.label) : group.label,
                    spacing: labelWidth + SPACING,
                    labelWidth: labelWidth,
                    frontColor,
                    barStyle: { left: labelWidth / 2 - barWidth / 2 },
                    disablePress,
                    leftShiftForTooltip: -labelWidth / 3
                });
            }
        });

        result.push({ label: "", barWidth: 0, labelWidth: 0, spacing: 0 }); //prevent overflow

        return result;
    };

    const barData = transformToBarData(chartData, legend);
    const maxValue = Math.max(...barData.map(data => data.value ?? 0));
    const chartMaxValue = Math.round(maxValue + maxValue * 0.2);

    const yAxisLabelWidth = X_AXIS_FONT_SIZE * 0.55 * (chartMaxValue.toString().length + 1.5 ?? 0);

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
                minHeight={ SEPARATOR_SIZES.lightSmall * 1.15 }
                disablePress
                roundedTop
                roundedBottom
                lineBehindBars
                noOfSections={ 7 }
                rulesType="solid"
                rulesColor={ COLORS.gray4 }
                xAxisLabelTextStyle={ styles.axisLabel }
                xAxisThickness={ 0 }
                yAxisSide="right"
                yAxisLabelWidth={ yAxisLabelWidth }
                yAxisTextStyle={ styles.axisLabel }
                yAxisThickness={ 0 }
                renderTooltip={ (item) => <PointerLabel value={ item.value }/> }
            />
            {
                legend &&
               <Legend legend={ legend }/>
            }
        </>
    );
}

const styles = StyleSheet.create({
    axisLabel: {
        fontFamily: "Gilroy-Medium",
        fontSize: X_AXIS_FONT_SIZE,
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