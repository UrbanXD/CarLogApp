import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../constants";
import { heightPercentageToDP } from "react-native-responsive-screen";

export type LegendType = {
    [key: string]: {
        label: string
        color: string
    }
}

type LegendProps = {
    legend: LegendType
    formatLegend?: (label: string) => string
}

export function Legend({ legend, formatLegend }: LegendProps) {
    return (
        <View style={ styles.container }>
            {
                Object.keys(legend).map((key) => (
                    <View key={ key } style={ styles.itemContainer }>
                        <View style={ [styles.itemDot, { backgroundColor: legend[key].color }] }/>
                        <Text style={ styles.itemText }>
                            { formatLegend?.(legend[key].label) ?? legend[key].label }
                        </Text>
                    </View>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        rowGap: SEPARATOR_SIZES.lightSmall,
        columnGap: SEPARATOR_SIZES.small,
        flexWrap: "wrap"
    },
    itemContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall / 2,
        alignItems: "center"
    },
    itemDot: {
        height: heightPercentageToDP(1),
        width: heightPercentageToDP(1),
        borderRadius: 100
    },
    itemText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4 * 0.9,
        color: COLORS.gray1
    }
});