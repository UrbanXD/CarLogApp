import React from "react";
import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import { SaveButton } from "../../../Button/presets/SaveButton.tsx";

export function DatePickerFooter() {
    const { submit } = useDatePicker();

    return (
        <SaveButton onPress={ submit }/>
    );
}