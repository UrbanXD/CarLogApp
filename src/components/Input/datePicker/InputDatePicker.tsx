import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES } from "../../../constants/index.ts";
import React, { useState } from "react";
import { DateType } from "react-native-ui-datepicker";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { DatePicker } from "./DatePicker.tsx";
import { DatePickerProvider } from "../../../contexts/datePicker/DatePickerProvider.tsx";
import { PopupView } from "../../popupView/PopupView.tsx";
import { DatePickerHeader } from "./header/DatePickerHeader.tsx";
import { DatePickerFooter } from "./footer/DatePickerFooter.tsx";
import dayjs from "dayjs";
import { scheduleOnRN } from "react-native-worklets";
import { InputDatePickerController } from "./InputDatePickerController.tsx";
import { DatePickerViews } from "../../../contexts/datePicker/DatePickerContext.ts";

function InputDatePicker() {
    const isExpanded = useSharedValue(false);

    const [selected, setSelected] = useState<dayjs.Dayjs>(dayjs("2018-08-01"));
    const [view, setView] = useState<DatePickerViews>("calendar");
    const [key, setKey] = useState(0); // for force reset

    const resetDatePicker = () => {
        setKey(prevState => ++prevState);
    };

    useAnimatedReaction(
        () => isExpanded.value,
        (expanded, previousExpanded) => {
            if(expanded !== previousExpanded && !expanded) scheduleOnRN(resetDatePicker);
        }
    );

    const open = (view: DatePickerViews) => {
        isExpanded.value = true;
        setView(view);
    };

    const close = () => {
        isExpanded.value = false;
    };

    const submit = (date: DateType) => {
        setSelected(dayjs(date).locale("hu"));
        isExpanded.value = false;
    };

    return (
        <>
            <InputDatePickerController date={ selected } open={ open } expanded={ isExpanded }/>
            <PopupView
                opened={ isExpanded }
                style={ styles.popupContainer }
            >
                <DatePickerProvider
                    key={ key }
                    initialDate={ selected }
                    initialView={ view }
                    locale="hu"
                    onSubmit={ submit }
                    onClose={ close }
                >
                    <DatePickerHeader/>
                    <DatePicker/>
                    <DatePickerFooter/>
                </DatePickerProvider>
            </PopupView>
        </>
    );
}

const styles = StyleSheet.create({
    popupContainer: {
        height: heightPercentageToDP(43),
        backgroundColor: COLORS.black5,
        paddingHorizontal: SEPARATOR_SIZES.small,
        paddingVertical: DEFAULT_SEPARATOR,
        borderRadius: 25
    }
});

export default InputDatePicker;