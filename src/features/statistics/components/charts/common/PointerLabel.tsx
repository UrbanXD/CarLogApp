import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import { MeasureElement } from "../../../../../components/marquee/helper/MeasureElement.tsx";
import { useEffect, useState } from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";

export const POINTER_LABEL_FONT_SIZE = FONT_SIZES.p4 * 0.9;
export const POINTER_LABEL_PADDING = SEPARATOR_SIZES.small;
export const POINTER_LABEL_MIN_WIDTH = widthPercentageToDP(10);

type PointerLabelProps = {
    value: string
    label?: string
    style?: ViewStyle
}

export function PointerLabel({ value, label, style }: PointerLabelProps) {
    const [valueTextWidth, setValueTextWidth] = useState<number>(0);
    const [labelTextWidth, setLabelTextWidth] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        setWidth(Math.max(POINTER_LABEL_MIN_WIDTH, Math.max(valueTextWidth, labelTextWidth)));
    }, [valueTextWidth, labelTextWidth]);

    return (
        <>
            {
                label &&
               <MeasureElement onLayout={ (width) => setLabelTextWidth(width + 2 * SEPARATOR_SIZES.small) }>
                  <Text style={ [styles.value] }>{ label }</Text>
               </MeasureElement>
            }
            <MeasureElement onLayout={ (width) => setValueTextWidth(width + 2 * SEPARATOR_SIZES.small) }>
                <Text style={ styles.label }>{ value }</Text>
            </MeasureElement>
            <View
                style={ [
                    styles.container,
                    {
                        width,
                        right: (width - 2 * SEPARATOR_SIZES.small) / 2
                    },
                    style
                ] }>
                {
                    label &&
                   <Text style={ styles.label }>{ label }</Text>
                }
                <Text style={ styles.value }>{ value }</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        justifyContent: "center",
        marginTop: SEPARATOR_SIZES.lightSmall / 2,
        marginBottom: SEPARATOR_SIZES.lightSmall / 2,
        paddingVertical: SEPARATOR_SIZES.lightSmall / 2,
        borderRadius: 16
    },
    label: {
        fontFamily: "Gilroy-Medium",
        fontSize: POINTER_LABEL_FONT_SIZE * 0.9,
        color: COLORS.gray4,
        textAlign: "center"
    },
    value: {
        fontFamily: "Gilroy-Heavy",
        fontSize: POINTER_LABEL_FONT_SIZE,
        color: COLORS.black4,
        textAlign: "center"
    }
});