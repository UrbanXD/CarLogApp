import { StyleSheet } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { Legend } from "./common/Legend.tsx";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import { PointerLabel } from "./common/PointerLabel.tsx";

const SPACING = 1.5;
const X_AXIS_FONT_SIZE = FONT_SIZES.p4 * 0.85;

export type BarChartItemType = {
    label: string
    color: string
};

export type BarChartItem = {
    label: string
    value: Array<number | string> | number | string
    type?: Array<string> | string
}

type BarChartViewProps = {
    chartData: Array<BarChartItem>
    itemTypes?: { [key: string]: BarChartItemType }
    barWidth?: number
}

export function BarChartView({
    chartData,
    itemTypes,
    barWidth = SEPARATOR_SIZES.lightSmall
}: BarChartViewProps) {
    const transformToBarData = (
        groups: Array<BarChartItem>,
        itemTypes: { [key: string]: BarChartItemType }
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
                    const typeInfo = typeKey ? itemTypes?.[typeKey] : undefined;
                    let frontColor = typeInfo?.color ?? "#000000";

                    if(value === "" || value === 0) frontColor = hexToRgba(frontColor, 0.35);

                    result.push({
                        value,
                        label: isFirst ? group.label : undefined,
                        spacing: isLast
                                 ? spacingBetweenStackedBars
                                 : SPACING,
                        labelWidth: isFirst ? labelWidth : undefined,
                        frontColor,
                        barStyle: { left: startLeft + index * SPACING },
                        disablePress: false,
                        leftShiftForTooltip: -startLeft - barWidth / 2 + (array.length - 1 - index) * SPACING
                    });
                });
            } else {
                const typeKey = Array.isArray(group.type) ? group.type?.[0] : group.type;
                const typeInfo = typeKey ? itemTypes?.[typeKey] : undefined;

                let frontColor = typeInfo?.color ?? "#000000";
                if(group.value === "" || group.value === 0) frontColor = hexToRgba(frontColor, 0.35);

                result.push({
                    value: group.value,
                    label: group.label,
                    spacing: labelWidth + SPACING,
                    labelWidth: labelWidth,
                    frontColor,
                    barStyle: { left: labelWidth / 2 - barWidth / 2 },
                    disablePress: group.value === "" || group.value === 0,
                    leftShiftForTooltip: startLeft + barWidth * 1.5  //megfixalni
                });
            }
        });

        result.push({ label: "", barWidth: 0, labelWidth: 0, spacing: 0 }); //prevent overflow

        return result;
    };

    const barData = transformToBarData(chartData, itemTypes);
    const maxValue = Math.max(...barData.map(data => data.value ?? 0));
    const chartMaxValue = Math.round(maxValue + maxValue * 0.1);

    const yAxisLabelWidth = X_AXIS_FONT_SIZE * 0.55 * (chartMaxValue.toString().length + 1.5 ?? 0);

    return (
        <>
            <Legend legend={ itemTypes }/>
            <BarChart
                data={ barData }
                maxValue={ chartMaxValue }
                barWidth={ barWidth }
                minHeight={ SEPARATOR_SIZES.lightSmall }
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