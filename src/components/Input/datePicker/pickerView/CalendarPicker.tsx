import React, { useEffect, useState } from "react";
import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import dayjs from "dayjs";
import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker";
import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZES } from "../../../../constants/index.ts";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";

export type SingleChange = (params: { date: DateType }) => void;

export type RangeChange = (params: {
    startDate: DateType;
    endDate: DateType;
}) => void;

export function CalendarPicker() {
    const defaultStyles = useDefaultStyles("dark");
    const { mode, startDate, setStartDate, endDate, setEndDate, calendarDate } = useDatePicker();

    const [year, setYear] = useState(dayjs(calendarDate).year());

    useEffect(() => {
        setYear(dayjs(calendarDate).year());
    }, [calendarDate]);

    const onDateChange: SingleChange = ({ date }) => {
        const newDate = date ? dayjs(date) : null;

        setStartDate((prev) => {
            if(!newDate) return null;

            const normalized = dayjs(prev ?? newDate)
            .set("year", newDate.year())
            .set("month", newDate.month())
            .set("date", newDate.date())
            .toDate();

            if(prev && dayjs(prev).isSame(normalized, "day")) return prev;
            return normalized;
        });
    };

    const onRangeDateChange: RangeChange = ({ startDate, endDate }) => {
        const newStartDate = startDate ? dayjs(startDate) : null;
        const newEndDate = endDate ? dayjs(endDate) : null;

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

    const datePickerStyles = {
        ...defaultStyles,
        weekdays: styles.weekdays,
        weekday_label: styles.weekDaysLabel,
        day_cell: styles.daysCell,
        day_label: styles.daysLabel,
        outside_label: [styles.daysLabel, styles.daysOutsideLabel],
        selected: styles.selected,
        selected_label: styles.selectedLabel,
        today_label: styles.todayLabel,
        range_start: styles.selectedRange,
        range_start_label: styles.selectedRangeLabel,
        range_end: styles.selectedRange,
        range_end_label: styles.selectedRangeLabel,
        range_fill: styles.selectedRangeFill
    };

    const commonProps = {
        year: year,
        month: dayjs(calendarDate).month(),
        initialView: "day" as const,
        hideHeader: true,
        disableMonthPicker: true,
        disableYearPicker: true,
        firstDayOfWeek: dayjs().weekday(0).get("day"),
        weekdaysFormat: "min" as const,
        showOutsideDays: true,
        locale: dayjs.locale(),
        containerHeight: heightPercentageToDP(25),
        styles: datePickerStyles as any
    };

    if(mode === "single") {
        return (
            <DateTimePicker
                { ...commonProps }
                mode="single"
                date={ startDate }
                onChange={ onDateChange }
            />
        );
    }

    if(mode === "range") {
        return (
            <DateTimePicker
                { ...commonProps }
                mode="range"
                startDate={ startDate }
                endDate={ endDate }
                onChange={ onRangeDateChange }
            />
        );
    }

    return <></>;
}

const styles = StyleSheet.create({
    weekdays: {
        borderColor: COLORS.gray1,
        borderBottomWidth: 0.50
    },
    weekDaysLabel: {
        fontFamily: "Gilroy-Medium",
        color: COLORS.gray2,
        textTransform: "capitalize"
    },
    daysCell: {
        borderColor: COLORS.gray5,
        borderWidth: 0.25
    },
    daysLabel: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.white2
    },
    daysOutsideLabel: {
        color: COLORS.gray2
    },
    todayLabel: {
        color: COLORS.fuelYellow
    },
    selected: {
        backgroundColor: COLORS.fuelYellow,
        borderRadius: 10
    },
    selectedLabel: {
        fontFamily: "Gilroy-Heavy",
        color: COLORS.black5
    },
    selectedRange: {
        backgroundColor: COLORS.fuelYellow,
        borderRadius: 10
    },
    selectedRangeLabel: {
        fontFamily: "Gilroy-Heavy",
        color: COLORS.black5
    },
    selectedRangeFill: {
        backgroundColor: hexToRgba(COLORS.fuelYellow, 0.1)
    }
});