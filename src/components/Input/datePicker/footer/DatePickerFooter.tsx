import { StyleSheet } from "react-native";
import Button from "../../../Button/Button.ts";
import { COLORS, FONT_SIZES } from "../../../../constants/index.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import React from "react";
import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";

export function DatePickerFooter() {
    const { submit } = useDatePicker();

    return (
        <Button.Text
            text="Mentés"
            fontSize={ FONT_SIZES.p2 }
            textColor={ COLORS.fuelYellow }
            backgroundColor="transparent"
            height={ hp(4.5) }
            style={ styles.button }
            onPress={ submit }
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
//
// <Button.Text
//     text="Mentés"
//     fontSize={ FONT_SIZES.p2 }
//     textColor={ COLORS.fuelYellow }
//     backgroundColor={ "transparent" }
//     height={ hp(4.5) }
//     style={ { width: "85%", borderWidth: 2, borderColor: COLORS.fuelYellow } }
//     onPress={ () => {} }
// />