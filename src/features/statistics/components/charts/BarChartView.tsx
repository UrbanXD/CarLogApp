import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { widthPercentageToDP } from "react-native-responsive-screen";

const WIDTH = widthPercentageToDP(100) - 2 * DEFAULT_SEPARATOR;
const BAR_WIDTH = SEPARATOR_SIZES.lightSmall;
const SPACING = 3.5;
const X_AXIS_FONT_SIZE = FONT_SIZES.p4 * 0.85;


export type BarChartItemType = {
    label: string
    color: string
};


export type BarChartItem = {
    label: string
    value: Array<number | string> | number | string
    types?: Array<string>
}

type BarChartViewProps = {
    chartData: Array<BarChartItem>
    itemTypes?: { [key: string]: BarChartItemType }
}

export function BarChartView() {
    const transformToBarData = (
        groups: BarChartItem[],
        itemTypes: { [key: string]: BarChartType },
        defaultSpacing: number = 2
    ): BarDataItem[] => {
        const result: BarDataItem[] = [];

        groups.forEach(group => {
            const count = group.values.length;
            const labelWidth = Math.max(
                X_AXIS_FONT_SIZE * 0.55 * (group.label.length ?? 0),
                SPACING * (count - 1) + BAR_WIDTH * count
            );

            const spacingBetweenStackedBars =
                labelWidth - SPACING * (count - 1) - BAR_WIDTH * count + SEPARATOR_SIZES.lightSmall;

            group.values.forEach((value, index, array) => {
                const isFirst = index === 0;
                const isLast = index === array.length - 1;

                const typeKey = group.typeKeys?.[index];
                const typeInfo = typeKey ? itemTypes[typeKey] : undefined;

                result.push({
                    value,
                    label: isFirst ? group.label : undefined,
                    spacing: isLast ? spacingBetweenStackedBars : defaultSpacing,
                    labelWidth: isFirst ? labelWidth : undefined,
                    frontColor: typeInfo?.color ?? "#000"
                });
            });
        });

        return result;
    };

    const itemTypes = {
        A: { label: "Type A", color: "#177AD5" },
        B: { label: "Type B", color: "#ED6665" },
        C: { label: "Type C", color: "green" },
        D: { label: "Type D", color: "yellow" }
    };

    const rawGroups: BarChartItem[] = [
        { label: "SimaBar", values: [100, 80], typeKeys: ["A", "D"] },
        { label: "Stack2", values: [40, 20], typeKeys: ["A", "B"] },
        { label: "Stack4", values: [50, 40, 60, 25], typeKeys: ["A", "B", "C", "D"] },
        { label: "NoTypes", values: [10, 20] }, // nincs typeKeys → fallback
        { label: "PartialTypes", values: [5, 15, 25], typeKeys: ["A"] } // csak az első stack-hez van type
    ];

    const barData = transformToBarData(rawGroups, itemTypes);

    return (
        <>
            <View
                style={ {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: 24
                } }>
                <View style={ { flexDirection: "row", alignItems: "center" } }>
                    <View
                        style={ {
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: "#177AD5",
                            marginRight: 8
                        } }
                    />
                    <Text
                        style={ {
                            width: 60,
                            height: 16,
                            color: "lightgray"
                        } }>
                        Point 01
                    </Text>
                </View>
                <View style={ { flexDirection: "row", alignItems: "center" } }>
                    <View
                        style={ {
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: "#ED6665",
                            marginRight: 8
                        } }
                    />
                    <Text
                        style={ {
                            width: 60,
                            height: 16,
                            color: "lightgray"
                        } }>
                        Point 02
                    </Text>
                </View>
            </View>
            <BarChart
                data={ barData }
                width={ WIDTH }
                barWidth={ SEPARATOR_SIZES.lightSmall }
                // spacing={ SEPARATOR_SIZES.medium }
                initialSpacing={ SEPARATOR_SIZES.small }
                roundedTop
                lineBehindBars
                rulesType="solid"
                rulesColor={ COLORS.gray4 }
                xAxisColor={ COLORS.gray1 }
                xAxisLabelTextStyle={ { color: COLORS.gray1, textAlign: "left", fontSize: X_AXIS_FONT_SIZE } }
                yAxisSide="right"
                yAxisLabelWidth={ 50 } /*dinamikusra*/
                yAxisTextStyle={ { color: COLORS.gray1 } }
                yAxisThickness={ 0 }
                autoShiftLabels
                noOfSections={ 6 }
                maxValue={ 75 }
            />
        </>
    );
}