import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, View } from "react-native";
import dayjs from "dayjs";
import { COLORS, FONT_SIZES } from "../../../../constants";
import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import { useTranslation } from "react-i18next";

type WheelDatePickerProps = {
    date: Date | null
    setDate: Dispatch<SetStateAction<Date | null>>
    timeReset?: boolean
    defaultStartOrEndTime?: "start" | "end"
}

const WebInput = "input" as any;
const inputStyle = {
    boxSizing: "border-box",
    width: "100%",
    minHeight: 54,
    padding: "12px 14px",
    border: "1px solid #37383A",
    borderRadius: 12,
    backgroundColor: "#202122",
    color: COLORS.white,
    colorScheme: "dark",
    fontFamily: "Gilroy-Medium",
    fontSize: 17,
    cursor: "pointer"
};

export function WheelDatePicker({ date, setDate, timeReset, defaultStartOrEndTime }: WheelDatePickerProps) {
    const { t } = useTranslation();
    const { maxDate, minDate } = useDatePicker();
    const minimum = dayjs(minDate);
    const maximum = dayjs(maxDate);
    const selectedDate = dayjs(date ?? new Date());

    const onChange = (event: any) => {
        const value = event.target.value as string;
        if(!value) return;

        const [year, month, day] = value.split("-").map(Number);
        if(!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return;

        const pickedDate = dayjs(new Date(year, month - 1, day));
        if(!pickedDate.isValid()) return;

        setDate(previous => {
            const previousDate = dayjs(previous ?? date ?? new Date());
            let nextDate = pickedDate
            .hour(previousDate.hour())
            .minute(previousDate.minute())
            .second(previousDate.second())
            .millisecond(previousDate.millisecond());

            if(nextDate.isBefore(minimum, "day")) nextDate = minimum;
            if(nextDate.isAfter(maximum, "day")) nextDate = maximum;
            if(timeReset) {
                nextDate = defaultStartOrEndTime === "end" ? nextDate.endOf("day") : nextDate.startOf("day");
            }

            return nextDate.toDate();
        });
    };

    return (
        <View style={ styles.container }>
            <Text style={ styles.label }>{ t("form.date_picker.date_placeholder") }</Text>
            <WebInput
                type="date"
                value={ selectedDate.format("YYYY-MM-DD") }
                min={ minimum.format("YYYY-MM-DD") }
                max={ maximum.format("YYYY-MM-DD") }
                onChange={ onChange }
                aria-label={ t("form.date_picker.date_placeholder") }
                style={ inputStyle }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        minHeight: 190,
        justifyContent: "center",
        gap: 12
    },
    label: {
        color: COLORS.gray2,
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        textAlign: "center"
    }
});
