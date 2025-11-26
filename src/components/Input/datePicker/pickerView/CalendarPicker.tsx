import React, { useEffect, useState } from "react";
import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import { RangeChange, SingleChange } from "react-native-ui-datepicker/lib/typescript/types";
import dayjs from "dayjs";
import { DateTimePickerUi } from "../common/DateTimePickerUi.tsx";

export function CalendarPicker() {
    const { mode, startDate, setStartDate, endDate, setEndDate, calendarDate } = useDatePicker();

    const [year, setYear] = useState(dayjs(calendarDate).year());

    useEffect(() => {
        setYear(dayjs(calendarDate).year());
    }, [calendarDate]);

    const onDateChange: SingleChange = ({ date: newDateObj }) => {
        const newDate = newDateObj ? dayjs(newDateObj) : null;

        setStartDate((prev) => {
            if(!newDate) return null;

            const normalized = dayjs(prev ?? newStartDate)
            .set("year", newStartDate.year())
            .set("month", newStartDate.month())
            .set("date", newStartDate.date())
            .toDate();

            if(prev && dayjs(prev).isSame(normalized, "day")) return prev;
            return normalized;
        });
    };

    const onRangeDateChange: RangeChange = ({ startDate: newStartDateObj, endDate: newEndDateObj }) => {
        const newStartDate = newStartDateObj ? dayjs(newStartDateObj) : null;
        const newEndDate = newEndDateObj ? dayjs(newEndDateObj) : null;

        setStartDate(prev => {
            if(!newStartDate) return null;

            const normalized = dayjs(prev ?? newStartDate)
            .set("year", newStartDate.year())
            .set("month", newStartDate.month())
            .set("date", newStartDate.date())
            .toDate();

            if(prev && dayjs(prev).isSame(normalized, "day")) return prev;
            return normalized;
        });

        setEndDate(prev => {
            if(!newEndDate) return null;

            const normalized = dayjs(prev ?? newEndDate)
            .set("year", newEndDate.year())
            .set("month", newEndDate.month())
            .set("date", newEndDate.date())
            .toDate();

            if(prev && dayjs(prev).isSame(normalized, "day")) return prev;
            return normalized;
        });
    };

    return (
        <DateTimePickerUi
            mode={ mode }
            date={ startDate }
            startDate={ startDate }
            endDate={ endDate }
            year={ year }
            month={ dayjs(calendarDate).month() }
            onChange={ mode === "single" ? onDateChange : onRangeDateChange }
        />
    );
}