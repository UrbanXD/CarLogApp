import { Context, createContext, useContext } from "react";

export type DatePickerViews = "calendar" | "wheel_picker" | "time";

type DatePickerContextValue = {
    date: Date
    setDate: (value: (((prevState: Date) => Date) | Date)) => void
    calendarDate: Date
    nextMonthInCalendar: () => void
    previousMonthInCalendar: () => void
    currentView: DatePickerViews
    openView: (view: DatePickerViews) => void
    locale: string
    minDate: Date
    maxDate: Date
    submit: () => void
}

export const DatePickerContext = createContext<DropdownPickerContextValue | null>(null);

export const useDatePicker = () => useContext<DatePickerContextValue>(DatePickerContext as Context<DatePickerContextValue>);