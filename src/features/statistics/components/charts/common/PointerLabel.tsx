import { StyleSheet, Text, View } from "react-native";
import { COLORS, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import { MeasureElement } from "../../../../../components/marquee/helper/MeasureElement.tsx";
import { useEffect, useState } from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";

type PointerLabelProps = {
    yAxisValue: string
    xAxisValue: string
}

export function PointerLabel({ yAxisValue, xAxisValue }: PointerLabelProps) {
    const [xAxisTextWidth, setXAxisTextWidth] = useState<number>(0);
    const [yAxisTextWidth, setYAxisTextWidth] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        setWidth(Math.max(widthPercentageToDP(15), Math.max(xAxisTextWidth, yAxisTextWidth)));
    }, [xAxisTextWidth, yAxisTextWidth]);

    return (
        <>
            <MeasureElement onLayout={ (width) => setYAxisTextWidth(width + 2 * SEPARATOR_SIZES.small) }>
                <Text style={ [styles.yAxisValueText] }>{ yAxisValue }</Text>
            </MeasureElement>
            <MeasureElement onLayout={ (width) => setXAxisTextWidth(width + 2 * SEPARATOR_SIZES.small) }>
                <Text style={ styles.xAxisValueText }>{ xAxisValue }</Text>
            </MeasureElement>
            <View
                onLayout={ (e) => setHeight(e.nativeEvent.layout.height) }
                style={ [
                    styles.container,
                    {
                        width,
                        top: ((-height - SEPARATOR_SIZES.lightSmall) * 1.5) - SEPARATOR_SIZES.lightSmall / 2,
                        right: (width - 2 * SEPARATOR_SIZES.small) / 2
                    }
                ] }>
                <Text style={ styles.xAxisValueText }>{ xAxisValue }</Text>
                <Text style={ styles.yAxisValueText }>{ yAxisValue }</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        justifyContent: "center",
        paddingVertical: SEPARATOR_SIZES.lightSmall / 2,
        borderRadius: 16
    },
    xAxisValueText: {
        fontFamily: "Gilroy-Medium",
        color: COLORS.gray4,
        textAlign: "center"
    },
    yAxisValueText: {
        fontFamily: "Gilroy-Heavy",
        color: COLORS.black4,
        textAlign: "center"
    }
});