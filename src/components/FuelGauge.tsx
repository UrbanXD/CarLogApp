import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Colors } from "../constants/colors/index.ts";
import { FONT_SIZES, SEPARATOR_SIZES } from "../constants/constants.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface FuelGaugeProps {
    value: number
    tankSize: number
    type: string
}

const FuelGauge: React.FC<FuelGaugeProps> = ({
    value,
    tankSize,
    type
}) => {
    const percent = (value / tankSize) * 100;

    const styles = useStyles(percent, value.toString().length + type.length);

    return (
        <>
            <View style={ styles.infoContainer }>
                <Text style={ styles.titleText }>Üzemanyagóra állás ({type})</Text>
                <Text style={ styles.contentText }>{percent.toFixed(2)}%</Text>
            </View>
            <View style={ styles.progressBar }>
                <View style={ styles.tag } />
                <View style={ [styles.tag, { left: "50%" }] } />
                <View style={ [styles.tag, { left: "75%" }] } />
                <View style={ [styles.bar, percent <= 26 && styles.lowFuelBar, percent > 76 && styles.highFuelBar]} />
                <View style={ styles.fuelValueContainer }>
                    <Text style={styles.fuelValueText}>{value}{type}</Text>
                </View>
            </View>
            <View style={ styles.fuelGaugeInfoContainer }>
                <Text style={ styles.fuelGaugeInfoText }>0{ type }</Text>
                <Text style={ styles.fuelGaugeInfoText }>{ tankSize }{ type }</Text>
            </View>
        </>
    )
}

const useStyles = (fuelPercent: number, fuelValueLength: number) => StyleSheet.create({
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    titleText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        color: Colors.gray1,
    },
    contentText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p4,
        color: Colors.gray1,
    },
    progressBar: {
        width: "100%",
        height: hp(5),
        backgroundColor: Colors.gray5,
    },
    bar: {
        position: "absolute",
        width: fuelPercent == 0 ? 1 : `${fuelPercent}%`,
        height: "100%",
        backgroundColor: Colors.fuelYellow,
    },
    lowFuelBar: {
        backgroundColor: "red"
    },
    highFuelBar: {
        backgroundColor: "green"
    },
    tag: {
        position: "absolute",
        left: "25%",
        width: 5,
        height: "100%",
        backgroundColor: Colors.black,
        zIndex: 1
    },
    fuelValueContainer: {
        position: "absolute",
        width: `${fuelPercent}%`,
        height: "100%",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: 2
    },
    fuelValueText: {
        position: "absolute",
        transform: fuelPercent > (FONT_SIZES.p4 * fuelValueLength / 3) ? [{ translateX: -SEPARATOR_SIZES.lightSmall }] : [{ translateX: FONT_SIZES.p4 * fuelValueLength }],
        backgroundColor: Colors.black,
        width: FONT_SIZES.p4 * fuelValueLength,
        borderRadius: 2.5,
        paddingVertical: 3.5,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall,
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p4,
        color: Colors.gray1,
        textAlign: "center",
    },
    fuelGaugeInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    fuelGaugeInfoText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: Colors.gray1,
    }
})

export default FuelGauge;