import { useSharedValue } from "react-native-reanimated";
import React, { Ref, useEffect, useImperativeHandle, useMemo, useState } from "react";
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
    ref?: Ref<InputDatePickerRef>
    title?: string
    mode?: "single" | "range"
    defaultStartDate?: DateType
    defaultEndDate?: DateType
    minDate?: DateType
    maxDate?: DateType
    setValue?: (date: string | Array<string | null> | null) => void
    hiddenController?: boolean
    showTimestamps?: boolean
}

function InputDatePicker({
    ref,
    title,
    mode = "single",
    defaultStartDate,
    defaultEndDate,
    maxDate,
    minDate,
    setValue,
    hiddenController = false,
    showTimestamps = true
}: InputDatePicker) {
    const { t } = useTranslation();

    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const fieldValue = useMemo(() => {
        const rawValue = inputFieldContext?.field?.value;

        if(mode === "range") {
            const safeRaw = Array.isArray(rawValue) ? rawValue : [];
            const [start, end] = safeRaw;

            return [
                (start && dayjs(start).isValid())
                ? dayjs(start).startOf("day").toDate()
                : (dayjs(defaultStartDate).isValid()
                   ? dayjs(defaultStartDate).startOf("day").toDate()
                   : null),
                (end && dayjs(end).isValid())
                ? dayjs(end).endOf("day").toDate()
                : (dayjs(defaultEndDate).isValid()
                   ? dayjs(defaultEndDate).endOf("day").toDate()
                   : null)
            ];
        }

        if(mode === "single" && rawValue && dayjs(rawValue).isValid()) {
            return [dayjs(rawValue).toDate()];
        }

        return [dayjs(defaultStartDate).isValid() ? dayjs(defaultStartDate).toDate() : null];
    }, [inputFieldContext?.field.value, defaultStartDate, defaultEndDate, mode]);

    const isExpanded = useSharedValue(false);

    const [date, setDate] = useState<Array<Date | null>>(fieldValue);
    const [view, setView] = useState<DatePickerViews>("calendar");

    useEffect(() => {
        const isSame = (d1: Date | null, d2: Date | null) => {
            if(!d1 && !d2) return true;
            if(!d1 || !d2) return false;
            return d1.getTime() === d2.getTime();
        };

        const hasChanged = fieldValue.some((d, i) => !isSame(d, date[i]));
        if(hasChanged) setDate(fieldValue);
    }, [fieldValue]);

    const handleDateChange = (newDates: Array<Date | null>) => {
        setDate(newDates);

        const output = mode === "single"
                       ? newDates[0]?.toISOString() ?? null
                       : newDates.map(d => d?.toISOString() ?? null);
        if(onChange) onChange(output);
        if(setValue) setValue(output);
    };

    const open = (view: DatePickerViews) => {
        isExpanded.value = true;
        setView(view);
    };

    const close = () => {
        isExpanded.value = false;
    };

    const submit = (startDate: Date | null, endDate: Date | null) => {
        let finalDates: Array<Date | null>;
        if(mode === "single") {
            finalDates = startDate ? [startDate] : [null];
        } else {
            const formatedStartDate = (startDate && dayjs(startDate).isValid()) ? dayjs(startDate)
            .startOf("day")
            .toDate() : null;
            const formatedEndDate = (endDate && dayjs(endDate).isValid())
                                    ? (dayjs(endDate).endOf("day").toDate())
                                    : null;

            finalDates = formatedStartDate && formatedEndDate
                         ? dayjs(formatedStartDate).isAfter(formatedEndDate)
                           ? [formatedEndDate, formatedStartDate]
                           : [formatedStartDate, formatedEndDate]
                         : [formatedStartDate, formatedEndDate];
        }

        handleDateChange(finalDates);
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
                    initialStartDate={ date?.[0] ?? undefined }
                    initialEndDate={ date?.[1] ?? undefined }
                    maxDate={ maxDate }
                    minDate={ minDate }
                    initialView={ view }
                    onSubmit={ submit }
                >
                    <DatePickerHeader
                        title={ title ?? t("form.date_picker.title") }
                        showTimestamps={ showTimestamps }
                    />
                    <DatePicker/>
                    <DatePickerFooter/>
                </DatePickerProvider>
            </PopupView>
        </>
    );
}

export default InputDatePicker;