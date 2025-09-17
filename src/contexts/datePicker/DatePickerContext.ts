import { Context, createContext, useContext } from "react";
import dayjs from "dayjs";

export type DatePickerViews = "calendar" | "wheel_picker" | "time";

export type ManipulateDateType = "add" | "subtract" | "set";

type DatePickerContextValue = {
    date: dayjs.Dayjs
    setDate: (value: (((prevState: dayjs.Dayjs) => dayjs.Dayjs) | dayjs.Dayjs)) => void
    calendarDate: dayjs.Dayjs
    nextMonthInCalendar: () => void
    previousMonthInCalendar: () => void
    currentView: DatePickerViews
    openView: (view: DatePickerViews) => void
    locale: string
    minDate: dayjs.Dayjs
    maxDate: dayjs.Dayjs
    submit: () => void
}

export const DatePickerContext = createContext<DropdownPickerContextValue | null>(null);

export const useDatePicker = () => useContext<DatePickerContextValue>(DatePickerContext as Context<DatePickerContextValue>);