import { Context, createContext, useContext } from "react";

export type DatePickerViews = "calendar" | "start_date_picker" | "end_date_picker" | "time";

type DatePickerContextValue = {
    mode: "single" | "range"
    startDate: Date | null
    endDate: Date | null
    setStartDate: (value: (((prevState: Date | null) => Date | null) | Date | null)) => void
    setEndDate: (value: (((prevState: Date | null) => Date | null) | Date | null)) => void
    calendarDate: Date
    nextMonthInCalendar: () => void
    previousMonthInCalendar: () => void
    currentView: DatePickerViews
    openView: (view: DatePickerViews) => void
    minDate: Date
    maxDate: Date
    submit: () => void
}

export const DatePickerContext = createContext<DropdownPickerContextValue | null>(null);

export const useDatePicker = () => useContext<DatePickerContextValue>(DatePickerContext as Context<DatePickerContextValue>);