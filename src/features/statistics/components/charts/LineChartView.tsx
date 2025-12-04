import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import React, { useMemo } from "react";
import { ChartTitle, ChartTitleProps } from "./common/ChartTitle.tsx";
import {
    POINTER_LABEL_FONT_SIZE,
    POINTER_LABEL_MIN_WIDTH,
    POINTER_LABEL_PADDING,
    PointerLabel
} from "./common/PointerLabel.tsx";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Pointer } from "./common/Pointer.tsx";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";
import { ChartDataNotFound } from "./common/ChartDataNotFound.tsx";
import { StyleSheet, View } from "react-native";
import { getYAxisProps } from "../../utils/getYAxisProps.ts";

const EXTRA_SPACING = SEPARATOR_SIZES.medium;
const AXIS_FONT_SIZE = FONT_SIZES.p4 * 0.85;
const PRIMARY_COLOR = COLORS.fuelYellow;
const POINTER_STRIP_COLOR = hexToRgba(COLORS.fuelYellow, 0.65);
const AXIS_COLOR = COLORS.gray1;
const DATA_POINT_SIZE = 12;
const FOCUSED_DATA_POINT_SIZE = DATA_POINT_SIZE * 1.25;
const THICKNESS = 3.5;

export type LineChartItem = lineDataItem

type LineChartViewProps = {
    chartData?: Array<LineChartItem>
    title?: ChartTitleProps
    formatLabel?: (label: string) => string
    formatValue?: (value: number | string) => string
    formatYAxisLabel?: boolean
    isLoading?: boolean
}

export function LineChartView({
    chartData = [],
    title,
    formatLabel,
    formatValue,
    formatYAxisLabel = false,
    isLoading = false
}: LineChartViewProps) {
    const formattedChartData = useMemo(() => {
        const data = chartData.map((g) => ({
            ...g,
            label: g.label ? (formatLabel?.(g.label) ?? g.label) : undefined
        }));

        data.unshift({ value: chartData?.[0]?.value, hidePointer: true });

        return data;
    }, [chartData]);


    const maxLabelWidth = Math.max(
        ...formattedChartData.map(item => AXIS_FONT_SIZE * 0.55 * (item.label?.length ?? 0))
    );

    const maxValue = Math.max(0, ...chartData.map(d => d.value ?? 0));
    const {
        chartMaxValue,
        yAxisLabelWidth,
        steps,
        showFractionalValues,
        precision,
        formatYLabel
    } = getYAxisProps({
        maxValue,
        fontSize: AXIS_FONT_SIZE,
        formatLabel: formatYAxisLabel ? formatValue : undefined
    });

    const firstPointerLabelWidth = 2 * POINTER_LABEL_PADDING + POINTER_LABEL_FONT_SIZE * 0.55 * ((formattedChartData?.[1]?.value?.toString() ?? "").length + 1.5);
    const lastPointerLabelWidth = 2 * POINTER_LABEL_PADDING + POINTER_LABEL_FONT_SIZE * 0.55 * ((formattedChartData?.[formattedChartData.length - 1]?.value?.toString() ?? "").length + 1.5);

    const spacing = maxLabelWidth + EXTRA_SPACING;
    const initialSpacing = -(Math.max(maxLabelWidth, Math.max(firstPointerLabelWidth, POINTER_LABEL_MIN_WIDTH))) / 2;
    const endSpacing =
        (EXTRA_SPACING / 2 + Math.max(maxLabelWidth, Math.max(lastPointerLabelWidth, POINTER_LABEL_MIN_WIDTH))) / 2;


    return (
        <View style={ styles.container }>
            {
                title &&
               <ChartTitle { ...title } />
            }
            {
                isLoading
                ? <MoreDataLoading/>
                : (
                    (!chartData || !formattedChartData || formattedChartData.length <= 1)
                    ? <ChartDataNotFound/>
                    : (
                        <LineChart
                            data={ formattedChartData }
                            width={ widthPercentageToDP(100) - yAxisLabelWidth }
                            curved
                            areaChart
                            isAnimated
                            animateOnDataChange
                            animationDuration={ 750 }
                            interpolateMissingValues
                            noOfSections={ steps }
                            maxValue={ chartMaxValue }
                            showFractionalValues={ showFractionalValues }
                            roundToDigits={ precision }
                            formatYLabel={ formatYLabel }
                            lineSegments={ formattedChartData.length > 0 && [
                                { startIndex: 0, endIndex: 1, strokeDashArray: [6, 4] }
                            ] }
                            spacing={ spacing }
                            initialSpacing={ initialSpacing }
                            endSpacing={ endSpacing }
                            color={ PRIMARY_COLOR }
                            thickness={ THICKNESS }
                            startFillColor={ PRIMARY_COLOR }
                            endFillColor={ PRIMARY_COLOR }
                            startOpacity={ 0.3 }
                            endOpacity={ 0.075 }
                            rulesType="solid"
                            rulesColor={ COLORS.gray4 }
                            yAxisSide="right"
                            yAxisLabelWidth={ yAxisLabelWidth }
                            yAxisThickness={ 0 }
                            yAxisTextStyle={ styles.axisLabel }
                            xAxisColor={ AXIS_COLOR }
                            xAxisThickness={ 1 }
                            xAxisLabelTextStyle={ [
                                styles.axisLabel,
                                {
                                    width: maxLabelWidth,
                                    marginLeft: (-maxLabelWidth + EXTRA_SPACING / 2) / 2
                                }
                            ] }
                            customDataPoint={
                                () => (
                                    <Pointer
                                        size={ DATA_POINT_SIZE }
                                        color={ COLORS.black2 }
                                        borderColor={ PRIMARY_COLOR }
                                        borderWidth={ THICKNESS / 1.5 }
                                    />
                                )
                            }
                            dataPointsWidth={ DATA_POINT_SIZE }
                            dataPointsHeight={ DATA_POINT_SIZE }
                            focusedDataPointHeight={ FOCUSED_DATA_POINT_SIZE }
                            focusedDataPointWidth={ FOCUSED_DATA_POINT_SIZE }
                            pointerConfig={ {
                                persistPointer: true,
                                pointerStripColor: POINTER_STRIP_COLOR,
                                pointerStripWidth: THICKNESS / 1.5,
                                pointerVanishDelay: 3000,
                                pointerComponent: () => (
                                    <Pointer
                                        size={ FOCUSED_DATA_POINT_SIZE }
                                        color={ COLORS.black2 }
                                        borderColor={ PRIMARY_COLOR }
                                        borderWidth={ THICKNESS / 1.5 }
                                    />
                                ),
                                radius: FOCUSED_DATA_POINT_SIZE / 2,
                                stripBehindBars: true,
                                pointerStripUptoDataPoint: true,
                                activatePointersOnLongPress: true,
                                autoAdjustPointerLabelPosition: true,
                                pointerLabelComponent: (items) => (
                                    <PointerLabel
                                        value={ formatValue?.(items[0].value) ?? items[0].value }
                                        label={ items[0].label }
                                    />
                                )
                            } }
                        />
                    )
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    axisLabel: {
        fontFamily: "Gilroy-Medium",
        fontSize: AXIS_FONT_SIZE,
        color: AXIS_COLOR
    }
});