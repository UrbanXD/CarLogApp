import React, { useCallback } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { OdometerText } from "./OdometerText.tsx";
import { OdometerUnitText } from "./UnitText.tsx";

type OdometerProps = {
    value: number | string
    unit?: string
}

export function Odometer({ value, unit }: OdometerProps) {
    const DEFAULT_VALUE_LENGTH = value.toString().length;
    value = value.toString().padStart(6, "0");

    const [odometerContainerWidth, setOdometerContainerWidth] = React.useState(0);

    const onOdometerContainerLayout = useCallback((event: LayoutChangeEvent) => {
        setOdometerContainerWidth(event.nativeEvent.layout.width);
    }, []);

    const styles = useStyles(value.length, odometerContainerWidth);

    return (
        <View style={ styles.container }>
            <View style={ styles.odometerContainer } onLayout={ onOdometerContainerLayout }>
                {
                    value.split("").map((digit, index) => (
                        <View key={ index } style={ styles.digitContainer }>
                            <OdometerText
                                text={ digit }
                                containerStyle={ { alignSelf: "center" } }
                                textStyle={ index < (value.length - DEFAULT_VALUE_LENGTH) && { opacity: 0 } }
                            />
                        </View>
                    ))
                }
            </View>
            {
                unit &&
               <OdometerUnitText text={ unit }/>
            }
        </View>
    );
}

const useStyles = (numberOfDigits: number, odometerContainerWidth: number) => StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: "row"
    },
    odometerContainer: {
        flexGrow: 1,
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        alignItems: "center",
        justifyContent: "center"
    },
    digitContainer: {
        minHeight: FONT_SIZES.p1 * 2,
        width: (odometerContainerWidth - SEPARATOR_SIZES.lightSmall * numberOfDigits) / numberOfDigits,
        position: "relative",
        backgroundColor: COLORS.gray5,
        alignItems: "center",
        justifyContent: "center"
    }
});