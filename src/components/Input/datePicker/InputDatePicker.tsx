import { useSharedValue } from "react-native-reanimated";
import React, { useEffect, useMemo, useState } from "react";
import { DateType } from "react-native-ui-datepicker";
import { DatePicker } from "./DatePicker.tsx";
import { DatePickerProvider } from "../../../contexts/datePicker/DatePickerProvider.tsx";
import { PopupView } from "../../popupView/PopupView.tsx";
import { DatePickerHeader } from "./header/DatePickerHeader.tsx";
import { DatePickerFooter } from "./footer/DatePickerFooter.tsx";
import dayjs from "dayjs";
import { InputDatePickerController } from "./InputDatePickerController.tsx";
import { DatePickerViews } from "../../../contexts/datePicker/DatePickerContext.ts";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { useTranslation } from "react-i18next";

type InputDatePicker = {
    title?: string
    defaultDate?: DateType
    minDate?: DateType
    maxDate?: DateType
}

function InputDatePicker({
    title,
    defaultDate,
    maxDate,
    minDate
}: InputDatePicker) {
    const { t } = useTranslation();

    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const fieldValue = useMemo(() => {
        const rawValue = inputFieldContext?.field.value;

        if(rawValue && dayjs(rawValue).isValid()) return dayjs(rawValue).toDate();

        return dayjs(defaultDate).toDate();
    }, [inputFieldContext?.field.value, defaultDate]);

    const isExpanded = useSharedValue(false);

    const [date, setDate] = useState<Date>(fieldValue);
    const [view, setView] = useState<DatePickerViews>("calendar");

    useEffect(() => {
        if(onChange) onChange(date);
    }, [date]);

    useEffect(() => {
        if(dayjs(date).isSame(fieldValue)) return;

        setDate(fieldValue);
    }, [fieldValue]);

    const open = (view: DatePickerViews) => {
        isExpanded.value = true;
        setView(view);
    };

    const close = () => {
        isExpanded.value = false;
    };

    const submit = (date: DateType) => {
        setDate(dayjs(date).toDate());
        isExpanded.value = false;
    };

    return (
        <>
            <InputDatePickerController date={ date } open={ open } expanded={ false }/>
            <PopupView opened={ isExpanded }>
                <DatePickerProvider
                    initialDate={ date }
                    maxDate={ maxDate }
                    minDate={ minDate }
                    initialView={ view }
                    onSubmit={ submit }
                    onClose={ close }
                >
                    <DatePickerHeader title={ title ?? t("form.date_picker.title") }/>
                    <DatePicker/>
                    <DatePickerFooter/>
                </DatePickerProvider>
            </PopupView>
        </>
    );
}

export default InputDatePicker;