import { ReactElement, useEffect, useState } from "react";
import dayjs from "dayjs";
import { CalendarViews } from "react-native-ui-datepicker/lib/typescript/enums";
import { DateType } from "react-native-ui-datepicker";
import { DatePickerContext, DatePickerViews } from "./DatePickerContext.ts";

export type DatePickerProviderProps = {
    children: ReactElement
    initialDate?: DateType
    initialView?: DatePickerViews
    locale?: string
    minDate?: DateType
    maxDate?: DateType
    onSubmit: (date: dayjs.Dayjs) => void
}

export function DatePickerProvider({
    children,
    initialDate,
    initialView = "calendar",
    locale = "hu",
    minDate = "1950-01-01",
    maxDate = "2050-12-31",
    onSubmit
}: DatePickerProviderProps) {
    const [date, setDate] = useState<dayjs.Dayjs>(dayjs(initialDate).locale(locale));
    const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(dayjs(initialDate).locale(locale));
    const [view, setView] = useState<CalendarViews>(initialView);

    useEffect(() => {
        setCalendarDate(date);
    }, [date]);

    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    const nextMonthInCalendar = () => {
        setCalendarDate(prevState => prevState.add(1, "month"));
    };

    const previousMonthInCalendar = () => {
        setCalendarDate(prevState => prevState.subtract(1, "month"));
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
                locale,
                minDate: dayjs(minDate),
                maxDate: dayjs(maxDate),
                submit
            } }
        >
            { children }
        </DatePickerContext.Provider>
    );
}