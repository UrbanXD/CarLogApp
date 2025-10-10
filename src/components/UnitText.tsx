import { StyleSheet, Text, TextStyle } from "react-native";
import { COLORS, FONT_SIZES } from "../../../../../constants/index.ts";

type OdometerUnitTextProps = {
    text: string
    style?: TextStyle
}

export function UnitText({ text, style }: OdometerUnitTextProps) {
    return (
        <Text style={ [styles.unitText, style] }>{ text }</Text>
    );
}

const styles = StyleSheet.create({
    unitText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        lineHeight: FONT_SIZES.p3,
        color: COLORS.gray1,
        alignSelf: "flex-end"
    }
});