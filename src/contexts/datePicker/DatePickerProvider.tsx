import { ReactElement, useEffect, useState } from "react";
import dayjs from "dayjs";
import { DateType } from "react-native-ui-datepicker";
import { DatePickerContext, DatePickerViews } from "./DatePickerContext.ts";
import { MAX_DATE, MIN_DATE } from "../../constants/index.ts";

export type DatePickerProviderProps = {
    children: ReactElement
    mode?: "single" | "range"
    initialStartDate?: DateType
    initialEndDate?: DateType
    initialView?: DatePickerViews
    minDate?: DateType
    maxDate?: DateType
    onSubmit: (startDate: Date | null, endDate: Date | null) => void
}

export function DatePickerProvider({
    children,
    mode = "single",
    initialStartDate,
    initialEndDate = mode === "range" ? initialStartDate : null,
    initialView = "calendar",
    minDate = MIN_DATE,
    maxDate = MAX_DATE,
    onSubmit
}: DatePickerProviderProps) {
    const [startDate, setStartDate] = useState<Date | null>(dayjs(initialStartDate).toDate());
    const [endDate, setEndDate] = useState<Date | null>(initialEndDate ? dayjs(initialEndDate).toDate() : null);
    const [calendarDate, setCalendarDate] = useState<Date>(dayjs(initialStartDate).toDate());
    const [view, setView] = useState<DatePickerViews>(initialView);

    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    useEffect(() => {
        if(mode === "range" && startDate && endDate && dayjs(startDate).isAfter(endDate)) {
            setStartDate(prevState => {
                setEndDate(prevState);
                return endDate;
            });
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if(
            startDate &&
            (
                !dayjs(calendarDate).isSame(startDate, "year") ||
                !dayjs(calendarDate).isSame(startDate, "month")
            )
        ) setCalendarDate(startDate);

    }, [startDate]);

    useEffect(() => {
        if(
            endDate &&
            (
                !dayjs(calendarDate).isSame(endDate, "year") ||
                !dayjs(calendarDate).isSame(endDate, "month")
            )
        ) setCalendarDate(endDate);

    }, [endDate]);

    const nextMonthInCalendar = () => {
        setCalendarDate(prevState => dayjs(prevState).add(1, "month").toDate());
    };

    const previousMonthInCalendar = () => {
        setCalendarDate(prevState => dayjs(prevState).subtract(1, "month").toDate());
    };

    const openView = (view: DatePickerViews) => setView(view);

    const submit = () => {
        onSubmit(startDate, endDate);
    };

    return (
        <DatePickerContext.Provider
            value={ {
                mode,
                startDate,
                setStartDate,
                endDate,
                setEndDate,
                calendarDate,
                nextMonthInCalendar,
                previousMonthInCalendar,
                currentView: view,
                openView,
                minDate: dayjs(minDate).toDate(),
                maxDate: dayjs(maxDate).toDate(),
                submit
            } }
        >
            { children }
        </DatePickerContext.Provider>
    );
}