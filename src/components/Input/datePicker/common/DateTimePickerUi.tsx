import {
    DatePickerMultipleProps,
    DatePickerRangeProps,
    DatePickerSingleProps
} from "react-native-ui-datepicker/src/datetime-picker.tsx";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import { Styles } from "react-native-ui-datepicker/lib/typescript/types";
import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZES } from "../../../../constants/index.ts";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import dayjs from "dayjs";
import { heightPercentageToDP } from "react-native-responsive-screen";

export function DateTimePickerUi(props: DatePickerSingleProps | DatePickerRangeProps | DatePickerMultipleProps) {
    const defaultStyles = useDefaultStyles("dark");

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
        today_label: styles.days.cell.today.label,
        range_start: styles.selected.rangeStart,
        range_start_label: styles.selected.rangeStart.label,
        range_end: styles.selected.rangeEnd,
        range_end_label: styles.selected.rangeEnd.label,
        range_fill: styles.selected.rangeFill
    };


    return (
        <DateTimePicker
            initialView="day"
            hideHeader
            disableMonthPicker
            disableYearPicker
            firstDayOfWeek={ dayjs().weekday(0).get("day") } // start with Monday (1) | Sunday is 0
            weekdaysFormat="min"
            showOutsideDays
            locale={ dayjs.locale() }
            containerHeight={ heightPercentageToDP(25) }
            { ...props }
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
        },

        rangeStart: {
            backgroundColor: COLORS.fuelYellow,
            borderRadius: 10,

            label: {
                fontFamily: "Gilroy-Heavy",
                color: COLORS.black5
            }
        },

        rangeEnd: {
            backgroundColor: COLORS.fuelYellow,
            borderRadius: 10,

            label: {
                fontFamily: "Gilroy-Heavy",
                color: COLORS.black5
            }
        },

        rangeFill: {
            backgroundColor: hexToRgba(COLORS.fuelYellow, 0.1)
        }
    }
});