import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { OdometerUnitText } from "./UnitText.tsx";

type OdometerTextProps = {
    text: string
    unit?: string
    containerStyle?: ViewStyle
    textStyle?: TextStyle
    backgroundTextStyle?: TextStyle
    unitTextStyle?: TextStyle
}

export function OdometerText({
    text,
    unit,
    containerStyle,
    textStyle,
    backgroundTextStyle,
    unitTextStyle
}: OdometerTextProps) {
    return (
        <View style={ [styles.container, containerStyle] }>
            <View style={ [styles.digitContainer] }>
                <Text style={ [styles.digitText, textStyle] }>
                    { text }
                </Text>
                <Text style={ [styles.digitText, textStyle, styles.backgroundDigitText, backgroundTextStyle] }>
                    { "8".repeat(text.length) }
                </Text>
            </View>
            {
                unit && <OdometerUnitText text={ unit } style={ unitTextStyle }/>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    digitContainer: {
        position: "relative",
        height: FONT_SIZES.p1
    },
    digitText: {
        fontFamily: "DSEG7",
        fontSize: FONT_SIZES.p1,
        color: COLORS.gray1,
        zIndex: 1
    },
    backgroundDigitText: {
        position: "absolute",
        opacity: 0.225
    }
});