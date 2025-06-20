import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Button from "../../../components/Button/Button.ts";

interface FuelGaugeProps {
    value: number;
    tankSize: number;
    fuelType: string;
    measurement: string;
    openEditForm?: () => void;
}

const FuelGauge: React.FC<FuelGaugeProps> = ({
    value,
    tankSize,
    fuelType,
    measurement,
    openEditForm
}) => {
    const percent = Math.max(Math.min((value / tankSize) * 100, 100), 0);
    const styles = useStyles(percent, value.toString().length + measurement.length + 1);

    return (
        <View style={ styles.container }>
            <View style={ styles.infoContainer }>
                <Text style={ styles.titleText }>
                    Üzemanyagóra ({ fuelType }){ "\n" }
                    <Text style={ styles.fuelValueText }>{ percent.toFixed(2) }%</Text>
                </Text>
                {
                    openEditForm &&
                   <Button.Icon
                      icon={ ICON_NAMES.pencil }
                      iconSize={ FONT_SIZES.h3 }
                      iconColor={ COLORS.gray1 }
                      width={ FONT_SIZES.h3 }
                      height={ FONT_SIZES.h3 }
                      style={ { alignSelf: "flex-end" } }
                      backgroundColor="transparent"
                      onPress={ openEditForm }
                   />
                }
            </View>
            <View style={ styles.progressBar }>
                <View style={ styles.tag }/>
                <View style={ [styles.tag, { left: "50%" }] }/>
                <View style={ [styles.tag, { left: "75%" }] }/>
                <View style={ [styles.bar, percent <= 26 && styles.lowFuelBar, percent > 76 && styles.highFuelBar] }/>
                <View style={ styles.fuelValueContainer }>
                    <Text style={ styles.fuelValueText }>{ value }{ measurement }</Text>
                </View>
            </View>
            <View style={ styles.fuelGaugeInfoContainer }>
                <Text style={ styles.fuelGaugeInfoText }>0{ measurement }</Text>
                <Text style={ styles.fuelGaugeInfoText }>{ tankSize }{ measurement }</Text>
            </View>
        </View>
    );
};

const useStyles = (fuelPercent: number, fuelValueLength: number) => StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: SEPARATOR_SIZES.lightSmall
    },
    titleText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        color: COLORS.gray1,
        flexShrink: 1
    },
    progressBar: {
        width: "100%",
        height: hp(5),
        backgroundColor: COLORS.gray5
    },
    bar: {
        position: "absolute",
        width: fuelPercent == 0 ? 1 : `${ fuelPercent }%`,
        height: "100%",
        backgroundColor: COLORS.fuelYellow
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
        backgroundColor: COLORS.black,
        zIndex: 1
    },
    fuelValueContainer: {
        position: "absolute",
        width: `${ fuelPercent }%`,
        height: "100%",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: 2
    },
    fuelValueText: {
        position: "absolute",
        transform: fuelPercent > (FONT_SIZES.p4 * fuelValueLength / 3)
                   ? []
                   : [{ translateX: FONT_SIZES.p4 * fuelValueLength }],
        backgroundColor: COLORS.black,
        width: FONT_SIZES.p4 * fuelValueLength,
        borderRadius: 2.5,
        paddingVertical: 3.5,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall,
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1,
        textAlign: "center"
    },
    fuelGaugeInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall
    },
    fuelGaugeInfoText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1
    }
});

export default FuelGauge;