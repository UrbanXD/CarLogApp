import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { COLORS, FONT_SIZES } from "../../../../../constants/index.ts";

type ChartDataNotFoundProps = {
    text?: string
    containerStyle?: ViewStyle
    textStyle?: TextStyle
}

export function ChartDataNotFound({ text, containerStyle, textStyle }: ChartDataNotFoundProps) {
    const { t } = useTranslation();

    return (
        <View style={ [containerStyle] }>
            <Text style={ [styles.text, textStyle] }>{ text ?? t("statistics.chart.not_enough_data") }</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray2
    }
});