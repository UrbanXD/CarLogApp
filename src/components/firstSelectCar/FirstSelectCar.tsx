import { StyleSheet, Text, View } from "react-native";
import { ScreenView } from "../screenView/ScreenView.tsx";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/index.ts";
import Icon from "../Icon.tsx";
import { useTranslation } from "react-i18next";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Button from "../Button/Button.ts";
import React from "react";
import useGarage from "../../features/car/hooks/useGarage.tsx";

export function FirstSelectCar() {
    const { t } = useTranslation();
    const { cars, openNewCarForm } = useGarage();

    return (
        <ScreenView style={ styles.container }>
            <View style={ styles.iconContainer }>
                <Icon
                    icon={ ICON_NAMES.upArrowHead }
                    size={ FONT_SIZES.h1 * ICON_FONT_SIZE_SCALE * 1.1 }
                    style={ {
                        marginBottom: -FONT_SIZES.h1 * ICON_FONT_SIZE_SCALE / 2,
                        marginLeft: -FONT_SIZES.h1 * ICON_FONT_SIZE_SCALE * 0.1
                    } }
                    // style={ { width: FONT_SIZES.h1 * ICON_FONT_SIZE_SCALE } }
                    // backgroundColor={ "red" }
                />
                <Icon icon={ ICON_NAMES.gestureTap } size={ FONT_SIZES.h1 * ICON_FONT_SIZE_SCALE }/>
            </View>
            <View style={ styles.textContainer }>
                <Text style={ styles.title }>{ t("first_select_car.title") }</Text>
                <Text style={ styles.description }>{ t("first_select_car.description") }</Text>
            </View>
            <Button.Text
                text={ t("garage.add_new_car") }
                width={ wp(75) }
                onPress={ openNewCarForm }
            />
        </ScreenView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: SEPARATOR_SIZES.small
    },
    iconContainer: {
        gap: 0,
        marginTop: -FONT_SIZES.h1 * ICON_FONT_SIZE_SCALE / 3.5
    },
    textContainer: {
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall / 2,
        marginBottom: SEPARATOR_SIZES.mediumSmall
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h2,
        lineHeight: FONT_SIZES.h2 * 1.15,
        letterSpacing: FONT_SIZES.h2 * 0.025,
        color: COLORS.white
    },
    description: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2 * 1.1,
        letterSpacing: FONT_SIZES.p2 * 0.025,
        color: COLORS.gray1,
        textAlign: "center"
    }
});