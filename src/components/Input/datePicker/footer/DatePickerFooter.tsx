import React from "react";
import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import { SaveButton } from "../../../Button/presets/SaveButton.tsx";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";

export function DatePickerFooter() {
    const { submit } = useDatePicker();

    return (
        <View style={ styles.container }>
            <SaveButton onPress={ submit }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: SEPARATOR_SIZES.lightSmall
    }
});