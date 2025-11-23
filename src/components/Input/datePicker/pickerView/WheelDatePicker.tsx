import { StyleSheet, Text } from "react-native";
import { COLORS, FONT_SIZES } from "../../../../constants/index.ts";
import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import { DatePicker, RenderItemProps } from "@quidone/react-native-wheel-picker";
import React, { ReactNode, useCallback } from "react";
import dayjs from "dayjs";
import { OnlyDateFormat } from "@quidone/react-native-wheel-picker/dest/typescript/date/date";
import { DateNodeType } from "@quidone/react-native-wheel-picker/dest/typescript/date/DatePickerContainer";
import { heightPercentageToDP } from "react-native-responsive-screen";

export function WheelDatePicker() {
    const { date, setDate, maxDate, minDate } = useDatePicker();

    const renderDate = useCallback(() => (
        <DatePicker.Date renderItem={ renderDateText } enableScrollByTapOnItem/>
    ), []);

    const renderDateText = useCallback((props: RenderItemProps<number>) => (
        <Text key={ props.index } style={ props.itemTextStyle }>
            { props.item.value.toString().padStart(2, "0") }
        </Text>
    ), []);

    const renderPickers = useCallback((props: { dateNodes: Array<{ node: ReactNode, type: DateNodeType }> }) => (
        props.dateNodes.map((x) => x.node)
    ), []);

    const onDateChanged = useCallback((event: { date: OnlyDateFormat }) => {
        const newDate = dayjs(event.date);

        setDate(prevState => dayjs(prevState)
            .set("year", newDate.year())
            .set("month", newDate.month())
            .set("date", newDate.date())
            .toDate()
        );
    }, []);

    return (
        <DatePicker
            date={ dayjs(date).format("YYYY-MM-DD") }
            minDate={ dayjs(minDate).format("YYYY-MM-DD") }
            maxDate={ dayjs(maxDate).format("YYYY-MM-DD") }
            locale={ dayjs.locale() }
            enableScrollByTapOnItem
            scrollEventThrottle={ 16 }
            pickerStyle={ styles.picker }
            itemTextStyle={ styles.label }
            overlayItemStyle={ styles.selectedItemContainer }
            visibleItemCount={ 7 }
            itemHeight={ heightPercentageToDP(5) }
            renderDate={ renderDate }
            onDateChanged={ onDateChanged }
        >
            { (event) => renderPickers(event) }
        </DatePicker>
    );
}

const styles = StyleSheet.create({
    picker: {
        flex: 1,
        justifyContent: "center"
    },
    selectedItemContainer: {
        backgroundColor: COLORS.white2,
        opacity: 0.10,
        borderRadius: 10
    },
    label: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        lineHeight: heightPercentageToDP(5),
        color: COLORS.white2,
        textAlign: "center",
        textAlignVertical: "center",
        textTransform: "capitalize"
    }
});