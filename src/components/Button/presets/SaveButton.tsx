import Button from "../Button.ts";
import { COLORS, FONT_SIZES } from "../../../constants/index.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import React from "react";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

type SaveButtonProps = {
    onPress: () => void
}

export function SaveButton({ onPress }: SaveButtonProps) {
    const { t } = useTranslation();

    return (
        <Button.Text
            text={ t("form_button.save") }
            fontSize={ FONT_SIZES.p2 }
            textColor={ COLORS.fuelYellow }
            backgroundColor="transparent"
            height={ hp(4.5) }
            style={ styles.button }
            onPress={ onPress }
        />
    );
}

const styles = StyleSheet.create({
    button: {
        width: "85%",
        borderWidth: 2,
        borderColor: COLORS.fuelYellow
    }
});