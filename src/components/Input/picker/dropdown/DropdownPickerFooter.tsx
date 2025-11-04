import React from "react";
import Button from "../../../Button/Button.ts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleSheet } from "react-native";

type DropdownPickerFooterProps = {
    onSubmit: () => void
}

export function DropdownPickerFooter({ onSubmit }: DropdownPickerFooterProps) {
    return (
        <Button.Text
            text="Mentés"
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