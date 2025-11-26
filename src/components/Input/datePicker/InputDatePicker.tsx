import { useSharedValue } from "react-native-reanimated";
import React, { useEffect, useImperativeHandle, useMemo, useState } from "react";
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

export type InputDatePickerRef = {
    open: (view: DatePickerViews) => void
    close: () => void
}

type InputDatePicker = {
    ref?: InputDatePickerRef
    title?: string
    mode?: "single" | "range"
    defaultDate?: DateType
    minDate?: DateType
    maxDate?: DateType
    setValue?: (date: Date | Array<Date>) => void
    hiddenController?: boolean
}

function InputDatePicker({
    ref,
    title,
    mode = "single",
    defaultDate,
    maxDate,
    minDate,
    setValue,
    hiddenController = false
}: InputDatePicker) {
    const { t } = useTranslation();

    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const fieldValue = useMemo(() => {
        const rawValue = inputFieldContext?.field?.value;

        if(mode === "range") {
            if(rawValue && Array.isArray(rawValue) && rawValue.length === 2) {
                const [start, end] = rawValue;

                return [
                    dayjs(start).isValid() ? dayjs(start).toDate() : null,
                    dayjs(end).isValid() ? dayjs(end).toDate() : null
                ];
            }

            return [dayjs(defaultDate).toDate(), dayjs(defaultDate).toDate()];
        }

        if(mode === "single" && rawValue && dayjs(rawValue).isValid()) {
            return [dayjs(rawValue).toDate()];
        }

        return [dayjs(defaultDate).toDate()];
    }, [inputFieldContext?.field.value, defaultDate]);

    const isExpanded = useSharedValue(false);

    const [date, setDate] = useState<Array<Date>>(fieldValue);
    const [view, setView] = useState<DatePickerViews>("calendar");

    useEffect(() => {
        if(onChange) onChange(mode === "single" ? date[0] : date);
        if(setValue) setValue(mode === "single" ? date[0] : date);
    }, [date]);

    useEffect(() => {
        if(fieldValue.length !== date.length) {
            setDate(fieldValue);
            return;
        }

        const hasDifference = fieldValue.some((newDate, i) => {
            const curr = date[i];

            const bothValid = dayjs(curr).isValid() && dayjs(newDate).isValid();
            if(bothValid) return !dayjs(curr).isSame(newDate);

            return curr !== newDate;
        });

        if(hasDifference) setDate(fieldValue);
    }, [fieldValue]);

    const open = (view: DatePickerViews) => {
        isExpanded.value = true;
        setView(view);
    };

    const close = () => {
        isExpanded.value = false;
    };

    const submit = (startDate: Date | null, endDate: Date | null) => {
        if(mode === "single") return setDate([startDate]);
        if(mode === "range") {
            setDate(
                startDate && endDate &&
                dayjs(startDate).isBefore(endDate)
                ? [endDate, startDate]
                : [startDate, endDate]
            );
        }
        setDate(mode === "single" ? [startDate] : [startDate, endDate]);
        isExpanded.value = false;
    };

    useImperativeHandle(ref, () => ({
        open,
        close
    }));

    return (
        <>
            {
                !hiddenController &&
               <InputDatePickerController date={ date } mode={ mode } open={ open }/>
            }
            <PopupView opened={ isExpanded }>
                <DatePickerProvider
                    mode={ mode }
                    initialStartDate={ date?.[0] }
                    initialEndDate={ date?.[1] }
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