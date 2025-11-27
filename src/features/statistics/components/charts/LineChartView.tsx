import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { widthPercentageToDP } from "react-native-responsive-screen";
import React from "react";
import { PointerLabel } from "./common/PointerLabel.tsx";


const WIDTH = widthPercentageToDP(100) - 2 * DEFAULT_SEPARATOR;

export type LineChartItem = lineDataItem

type LineChartViewProps = {
    graphData: Array<LineChartItem>
}

export function LineChartView({
    graphData
}: LineChartViewProps) {
    const maxValue = Math.max(...graphData.map(d => d.value ?? 0));
    const chartMaxValue = maxValue + maxValue * 0.2;

    return (
        <LineChart
            data={ graphData }
            // isAnimated
            areaChart
            // showValuesAsDataPointsText
            // focusEnabled
            // showStripOnFocus
            // showTextOnFocus
            // delayBeforeUnFocus={ 5000 }
            width={ WIDTH }
            hideDataPoints
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
            yAxisLabelWidth={ 50 } /*dinamikusra kene*/
            xAxisColor={ COLORS.gray1 }
            // disableScroll={ true }
            pointerConfig={ {
                persistPointer: true,
                pointerStripColor: COLORS.gray1,
                pointerStripWidth: 2,
                pointerVanishDelay: 2000,
                pointerColor: COLORS.gray1,
                radius: 6,
                pointerStripUptoDataPoint: true,
                activatePointersOnLongPress: true,
                // autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: (items) => (
                    <PointerLabel yAxisValue={ items[0].value } xAxisValue={ items[0].label }/>
                )
            } }
        />
    );
}