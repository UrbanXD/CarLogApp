import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, View } from "react-native";
import dayjs from "dayjs";
import { COLORS, FONT_SIZES } from "../../../../constants";
import { useTranslation } from "react-i18next";

type TimePickerProps = {
    date: Date | null
    setDate: Dispatch<SetStateAction<Date | null>>
}

const WebInput = "input" as any;
const inputStyle = {
    boxSizing: "border-box",
    width: 220,
    minHeight: 54,
    padding: "12px 14px",
    border: "1px solid #37383A",
    borderRadius: 12,
    backgroundColor: "#202122",
    color: COLORS.white,
    colorScheme: "dark",
    fontFamily: "Gilroy-Medium",
    fontSize: 19,
    cursor: "pointer"
};

export function TimePicker({ date, setDate }: TimePickerProps) {
    const { t } = useTranslation();
    const selectedDate = dayjs(date ?? new Date());

    const onChange = (event: any) => {
        const [hours, minutes] = (event.target.value as string).split(":").map(Number);
        if(!Number.isFinite(hours) || !Number.isFinite(minutes)) return;

        setDate(previous => dayjs(previous ?? date ?? new Date())
        .hour(hours)
        .minute(minutes)
        .toDate());
    };

    return (
        <View style={ styles.container }>
            <Text style={ styles.label }>{ t("form.date_picker.time_placeholder") }</Text>
            <WebInput
                type="time"
                value={ selectedDate.format("HH:mm") }
                step={ 60 }
                onChange={ onChange }
                aria-label={ t("form.date_picker.time_placeholder") }
                style={ inputStyle }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        minHeight: 190,
        alignItems: "center",
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
