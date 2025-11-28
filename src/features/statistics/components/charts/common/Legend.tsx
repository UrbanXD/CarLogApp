import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";

export type LegendData = {
    label: string
    color: string
}

type LegendProps = {
    legend: { [key: string]: LegendData }
}

export function Legend({ legend }: LegendProps) {
    return (
        <View style={ styles.container }>
            {
                Object.keys(legend).map((key) => (
                    <View key={ key } style={ styles.itemContainer }>
                        <View style={ [styles.itemDot, { backgroundColor: legend[key].color }] }/>
                        <Text style={ styles.itemText }>
                            { legend[key].label }
                        </Text>
                    </View>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        gap: SEPARATOR_SIZES.small,
        flexWrap: "wrap"
    },
    itemContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall / 2,
        alignItems: "center"
    },
    itemDot: {
        height: heightPercentageToDP(1.25),
        width: heightPercentageToDP(1.25),
        borderRadius: 100
    },
    itemText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1
    }
});