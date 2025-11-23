import { ReactElement, useEffect, useState } from "react";
import dayjs from "dayjs";
import { CalendarViews } from "react-native-ui-datepicker/lib/typescript/enums";
import { DateType } from "react-native-ui-datepicker";
import { DatePickerContext, DatePickerViews } from "./DatePickerContext.ts";
import { MAX_DATE, MIN_DATE } from "../../constants/index.ts";

export type DatePickerProviderProps = {
    children: ReactElement
    initialDate?: DateType
    initialView?: DatePickerViews
    minDate?: DateType
    maxDate?: DateType
    onSubmit: (date: dayjs.Dayjs) => void
}

export function DatePickerProvider({
    children,
    initialDate,
    initialView = "calendar",
    minDate = MIN_DATE,
    maxDate = MAX_DATE,
    onSubmit
}: DatePickerProviderProps) {
    const [date, setDate] = useState<Date>(dayjs(initialDate).toDate());
    const [calendarDate, setCalendarDate] = useState<Date>(dayjs(initialDate).toDate());
    const [view, setView] = useState<CalendarViews>(initialView);

    useEffect(() => {
        setCalendarDate(date);
    }, [date]);

    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    const nextMonthInCalendar = () => {
        setCalendarDate(prevState => dayjs(prevState).add(1, "month").toDate());
    };

    const previousMonthInCalendar = () => {
        setCalendarDate(prevState => dayjs(prevState).subtract(1, "month").toDate());
    };

    const openView = (view: DatePickerViews) => setView(view);

    const submit = () => {
        onSubmit(date);
    };

    return (
        <DatePickerContext.Provider
            value={ {
                date,
                setDate,
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