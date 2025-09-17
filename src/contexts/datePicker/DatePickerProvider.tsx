import { ReactElement, useState } from "react";
import dayjs from "dayjs";
import { CalendarViews } from "react-native-ui-datepicker/lib/typescript/enums";
import { DateType } from "react-native-ui-datepicker";
import { DatePickerContext, DatePickerViews, ManipulateDateType } from "./DatePickerContext.ts";

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

    const manipulate = (date: dayjs.Dayjs, type: ManipulateDateType, value: number, unit: dayjs.UnitType) => {
        switch(type) {
            case "add":
                return date.add(value, unit);
            case "subtract":
                return date.subtract(value, unit);
            case "set":
                return date.set(unit, value);
        }
    };

    const manipulateDate = (type: ManipulateDateType, value: number, unit: dayjs.UnitType) => {
        setDate(prevState => manipulate(prevState, type, value, unit));
    };

    const nextMonthInCalendar = () => {
        setCalendarDate(manipulate(calendarDate, "add", 1, "month"));
    };

    const previousMonthInCalendar = () => {
        setCalendarDate(manipulate(calendarDate, "subtract", 1, "month"));
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
                manipulateDate,
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