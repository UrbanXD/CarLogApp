import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import React from "react";
import { PointerLabel } from "./common/PointerLabel.tsx";
import { ChartTitle, ChartTitleProps } from "./common/ChartTitle.tsx";
import { widthPercentageToDP } from "react-native-responsive-screen";

const AXIS_FONT_SIZE = FONT_SIZES.p4 * 0.85;

export type LineChartItem = lineDataItem

type LineChartViewProps = {
    graphData: Array<LineChartItem>
    title?: ChartTitleProps
}

export function LineChartView({
    graphData,
    title
}: LineChartViewProps) {
    const maxValue = Math.max(...graphData.map(d => d.value ?? 0));
    const chartMaxValue = maxValue + maxValue * 0.2;

    const yAxisLabelWidth = AXIS_FONT_SIZE * 0.55 * (chartMaxValue.toString().length + 1.5 ?? 0);

    return (
        <>
            {
                title &&
               <ChartTitle { ...title } />
            }
            <LineChart
                data={ graphData }
                // isAnimated
                areaChart
                hideDataPoints
                width={ widthPercentageToDP(100) - yAxisLabelWidth }
                spacing={ SEPARATOR_SIZES.small }
                initialSpacing={ 0 }
                color={ COLORS.fuelYellow }
                thickness={ 2.5 }
                startFillColor={ COLORS.fuelYellow }
                endFillColor={ COLORS.fuelYellow }
                startOpacity={ 0.3 }
                endOpacity={ 0.075 }
                noOfSections={ 6 }
                maxValue={ chartMaxValue }
                yAxisColor={ COLORS.gray1 }
                yAxisThickness={ 0 }
                rulesType="solid"
                rulesColor={ COLORS.gray4 }
                yAxisTextStyle={ { color: COLORS.gray2 } }
                yAxisSide="right"
                yAxisLabelWidth={ yAxisLabelWidth }
                xAxisColor={ COLORS.gray1 }
                xAxisLabelTextStyle={ { color: "red", width: 50 } }
                xAxisThickness={ 1 }
                disableScroll={ true }
                rotateLabel={ true }
                pointerConfig={ {
                    persistPointer: true,
                    pointerStripColor: COLORS.gray1,
                    pointerStripWidth: 2,
                    pointerVanishDelay: 2000,
                    pointerColor: COLORS.gray1,
                    radius: 6,
                    stripBehindBars: true,
                    pointerStripUptoDataPoint: true,
                    activatePointersOnLongPress: true,
                    autoAdjustPointerLabelPosition: true,
                    pointerLabelComponent: (items) => (
                        <PointerLabel value={ items[0].value } label={ items[0].label }/>
                    )
                } }
            />
        </>
    );
}