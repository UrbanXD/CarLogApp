import { Context, createContext, useContext } from "react";
import dayjs from "dayjs";

export type DatePickerViews = "calendar" | "wheel_picker" | "time";

export type ManipulateDateType = "add" | "subtract" | "set";

type DatePickerContextValue = {
    date: dayjs.Dayjs
    setDate: (date: dayjs.Dayjs) => void
    manipulateDate: (type: ManipulateDateType, value: number, unit: dayjs.UnitType) => dayjs.Dayjs
    currentView: DatePickerViews
    openView: (view: DatePickerViews) => void
    locale: string
    minDate: dayjs.Dayjs
    maxDate: dayjs.Dayjs
    submit: () => void
}

export const DatePickerContext = createContext<DropdownPickerContextValue | null>(null);

export const useDatePicker = () => useContext<DatePickerContextValue>(DatePickerContext as Context<DatePickerContextValue>);