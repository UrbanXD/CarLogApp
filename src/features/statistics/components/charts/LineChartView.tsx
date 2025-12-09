import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import React, { useMemo, useState } from "react";
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
import { StyleSheet, Text, View } from "react-native";
import { getYAxisProps } from "../../utils/getYAxisProps.ts";

const CHART_HEIGHT = 225;
const EXTRA_SPACING = SEPARATOR_SIZES.medium;
const AXIS_FONT_SIZE = FONT_SIZES.p4 * 0.85;
const AXIS_TITLE_FONT_SIZE = AXIS_FONT_SIZE * 1.2;
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
    yAxisTitle?: string
    xAxisTitle?: string
    formatLabel?: (label: string) => string
    formatValue?: (value: number | string) => string
    formatYAxisLabelAsValue?: boolean
    isLoading?: boolean
}

export function LineChartView({
    chartData = [],
    title,
    yAxisTitle,
    xAxisTitle,
    formatLabel,
    formatValue,
    formatYAxisLabelAsValue = false,
    isLoading = false
}: LineChartViewProps) {
    const [yAxisTitleLines, setYAxisTitleLines] = useState(1);

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
        formatLabel: formatYAxisLabelAsValue ? formatValue : undefined
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
                        <View style={ styles.containerWithYAxisTitle }>
                            {
                                yAxisTitle &&
                               <View style={ [
                                   styles.yAxisTitleWrapper,
                                   { width: AXIS_TITLE_FONT_SIZE * yAxisTitleLines }
                               ] }>
                                  <Text onTextLayout={ (event) => setYAxisTitleLines(event.nativeEvent.lines.length) }
                                        style={ [styles.axisTitle, styles.yAxisTitle] }>{ yAxisTitle }</Text>
                               </View>
                            }
                            <View style={ styles.containerWithXAxisTitle }>
                                <LineChart
                                    data={ formattedChartData }
                                    width={
                                        widthPercentageToDP(100)
                                        - yAxisLabelWidth
                                        - (yAxisTitle ? AXIS_TITLE_FONT_SIZE * yAxisTitleLines : 0)
                                    }
                                    height={ CHART_HEIGHT }
                                    curved
                                    areaChart
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
                                {
                                    xAxisTitle &&
                                   <Text style={ styles.axisTitle }>{ xAxisTitle }</Text>
                                }
                            </View>
                        </View>
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
    containerWithYAxisTitle: {
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
        transform: [{ rotate: "-90deg" }]
    },
    axisLabel: {
        fontFamily: "Gilroy-Medium",
        fontSize: AXIS_FONT_SIZE,
        color: AXIS_COLOR
    }
});