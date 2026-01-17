import React from "react";
import Button from "../../../Button/Button.ts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

type DropdownPickerFooterProps = {
    onSubmit: () => void
}

export function DropdownPickerFooter({ onSubmit }: DropdownPickerFooterProps) {
    const { t } = useTranslation();

    return (
        <Button.Text
            text={ t("form_button.save") }
            fontSize={ FONT_SIZES.p2 }
            textColor={ COLORS.fuelYellow }
            backgroundColor="transparent"
            height={ hp(4.5) }
            style={ styles.button }
            onPress={ onSubmit }
        />
    );
}

const styles = StyleSheet.create({
    button: {
        width: "85%",
        borderWidth: 2,
        borderColor: COLORS.fuelYellow,
        marginTop: SEPARATOR_SIZES.lightSmall
    }
});