import React, { useCallback } from "react";
import { LayoutChangeEvent, Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import { OdometerText } from "./OdometerText.tsx";
import { UnitText } from "../../../../../components/UnitText.tsx";
import { ViewStyle } from "../../../../../types/index.ts";

type OdometerProps = {
    value: number | string
    unit?: string
    containerStyle?: ViewStyle
}

export function Odometer({ value, unit, containerStyle }: OdometerProps) {
    const { width: windowWidth } = useWindowDimensions();
    const desktop = Platform.OS === "web" && windowWidth >= 1040;
    const DEFAULT_VALUE_LENGTH = value.toString().length;
    value = value.toString().padStart(6, "0");

    const [odometerContainerWidth, setOdometerContainerWidth] = React.useState(0);

    const onOdometerContainerLayout = useCallback((event: LayoutChangeEvent) => {
        setOdometerContainerWidth(event.nativeEvent.layout.width);
    }, []);

    const unitWidth = unit ? unit.length * FONT_SIZES.p3 * 0.65 + SEPARATOR_SIZES.lightSmall : 0;
    const odometerWidth = Math.max(0, Math.min(475, odometerContainerWidth - unitWidth));
    const styles = useStyles(value.length, odometerWidth, desktop);

    return (
        <View style={ [styles.container, containerStyle] } onLayout={ onOdometerContainerLayout }>
            <View style={ styles.odometerContainer }>
                {
                    value.split("").map((digit, index) => (
                        <View key={ index } style={ styles.digitContainer }>
                            <OdometerText
                                text={ digit }
                                containerStyle={ { alignSelf: "center" } }
                                textStyle={ index < (value.length - DEFAULT_VALUE_LENGTH) ? { opacity: 0 } : undefined }
                            />
                        </View>
                    ))
                }
            </View>
            {
                unit &&
               <UnitText text={ unit }/>
            }
        </View>
    );
}

const useStyles = (numberOfDigits: number, odometerContainerWidth: number, desktop: boolean) => StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: desktop ? "flex-start" : "center",
        alignSelf: "stretch",
        gap: SEPARATOR_SIZES.lightSmall
    },
    odometerContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: odometerContainerWidth,
        flexShrink: 0
    },
    digitContainer: {
        minHeight: FONT_SIZES.p1 * 2,
        width: Math.max(
            0,
            (odometerContainerWidth - SEPARATOR_SIZES.lightSmall * (numberOfDigits - 1)) / numberOfDigits
        ),
        position: "relative",
        backgroundColor: COLORS.gray5,
        alignItems: "center",
        justifyContent: "center"
    }
});
