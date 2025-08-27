import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Button from "../../../components/Button/Button.ts";
import Input from "../../../components/Input/Input.ts";

type FuelGaugeProps = {
    value: number
    tankSize: number
    fuelType: string
    measurement: string
    disabled?: boolean
    openEditForm?: () => void
}

const FuelGauge: React.FC<FuelGaugeProps> = ({
    value,
    tankSize,
    fuelType,
    measurement,
    disabled = false,
    openEditForm
}) => {
    const [fuelValue, setFuelValue] = useState(value ?? 0);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        setPercent(calculatePercent(0, tankSize, fuelValue));
    }, [fuelValue, tankSize]);

    const calculatePercent = (min: number, max: number, value: number) => {
        return Math.max(0, Math.min(100, (value / tankSize) * 100));
    };

    return (
        <View style={ styles.container }>
            <View style={ styles.infoContainer }>
                <Text style={ styles.infoContainer.title }>
                    Üzemanyagóra ({ fuelType }){ "\n" }
                    <Text style={ styles.infoContainer.text }>{ percent.toFixed(2) }%</Text>
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
            <Input.Slider
                minValue={ 0 }
                maxValue={ tankSize }
                measurement={ measurement }
                value={ value ?? 0 }
                setValue={ setFuelValue }
                disabled={ disabled }
                style={ {
                    showsHandle: false,
                    showsTag: true,
                    innerTooltip: true,
                    borderRadius: 0,
                    trackBorderWidth: 0,
                    barColor: [
                        { color: "#FF3B30", percent: 0 },
                        { color: "#FFCC00", percent: 45 },
                        { color: "#02c227", percent: 75 },
                        { color: "#02a121", percent: 100 }
                    ],
                    tooltipColor: COLORS.gray5,
                    trackHeight: heightPercentageToDP(6)
                } }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: SEPARATOR_SIZES.lightSmall,

        title: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            letterSpacing: FONT_SIZES.p2 * 0.05,
            color: COLORS.gray1,
            flexShrink: 1
        },

        text: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.p4,
            color: COLORS.gray1
        }
    }
});

export default FuelGauge;