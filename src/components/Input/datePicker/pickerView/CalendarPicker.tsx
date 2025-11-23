import React, { useEffect, useState } from "react";
import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import { SingleChange, Styles } from "react-native-ui-datepicker/lib/typescript/types";
import { heightPercentageToDP } from "react-native-responsive-screen";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZES } from "../../../../constants/index.ts";

export function CalendarPicker() {
    const { date, setDate, calendarDate } = useDatePicker();
    const defaultStyles = useDefaultStyles("dark");

    const [year, setYear] = useState(dayjs(calendarDate).year());

    useEffect(() => {
        setYear(dayjs(calendarDate).year());
    }, [calendarDate]);

    const onDateChange: SingleChange = ({ date: newDateObj }) => {
        const newDate = dayjs(newDateObj);

        setDate(prevState =>
            dayjs(prevState)
            .set("year", newDate.year())
            .set("month", newDate.month())
            .set("date", newDate.date())
            .toDate()
        );
    };

    const datePickerStyles: Styles = {
        ...defaultStyles,
        weekdays: styles.weekdays,
        weekday_label: styles.weekdays.label,
        days: styles.contentBackground,
        day_cell: styles.days.cell,
        day_label: styles.days.cell.label,
        outside_label: [styles.days.cell.label, styles.days.cell.outsideLabel],
        selected: styles.selected,
        selected_label: styles.selected.label,
        today: styles.days.cell.today,
        today_label: styles.days.cell.today.label
    };

    return (
        <DateTimePicker
            mode="single"
            initialView="day"
            hideHeader
            disableMonthPicker
            disableYearPicker
            firstDayOfWeek={ dayjs().weekday(0).get("day") } // start with Monday (1) | Sunday is 0
            weekdaysFormat="min"
            showOutsideDays
            date={ date }
            year={ year }
            month={ dayjs(calendarDate).month() }
            onChange={ onDateChange }
            locale={ dayjs.locale() }
            containerHeight={ heightPercentageToDP(25) }
            styles={ datePickerStyles }
        />
    );
}

const styles = StyleSheet.create({
    weekdays: {
        borderColor: COLORS.gray1,
        borderBottomWidth: 0.50,

        label: {
            fontFamily: "Gilroy-Medium",
            color: COLORS.gray2,
            textTransform: "capitalize"
        }
    },
    days: {
        cell: {
            borderColor: COLORS.gray5,
            borderWidth: 0.25,

            label: {
                fontFamily: "Gilroy-Medium",
                fontSize: FONT_SIZES.p4,
                color: COLORS.white2
            },

            outsideLabel: {
                color: COLORS.gray2
            },

            today: {
                label: {
                    color: COLORS.fuelYellow
                }
            }
        }
    },
    selected: {
        backgroundColor: COLORS.fuelYellow,
        borderRadius: 10,

        label: {
            fontFamily: "Gilroy-Heavy",
            color: COLORS.black5
        }
    }
});