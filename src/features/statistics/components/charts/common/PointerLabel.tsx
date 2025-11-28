import { StyleSheet, Text, View } from "react-native";
import { COLORS, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import { MeasureElement } from "../../../../../components/marquee/helper/MeasureElement.tsx";
import { useEffect, useState } from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";

type PointerLabelProps = {
    value: string
    label?: string
}

export function PointerLabel({ value, label }: PointerLabelProps) {
    const [valueTextWidth, setValueTextWidth] = useState<number>(0);
    const [labelTextWidth, setLabelTextWidth] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        setWidth(Math.max(widthPercentageToDP(10), Math.max(valueTextWidth, labelTextWidth)));
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
                        marginBottom: SEPARATOR_SIZES.lightSmall / 2,
                        right: (width - 2 * SEPARATOR_SIZES.small) / 2
                    }
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
        paddingVertical: SEPARATOR_SIZES.lightSmall / 2,
        borderRadius: 16
    },
    label: {
        fontFamily: "Gilroy-Medium",
        color: COLORS.gray4,
        textAlign: "center"
    },
    value: {
        fontFamily: "Gilroy-Heavy",
        color: COLORS.black4,
        textAlign: "center"
    }
});