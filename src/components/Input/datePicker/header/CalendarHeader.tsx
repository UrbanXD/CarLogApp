import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import { StyleSheet, Text } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES } from "../../../../constants/index.ts";
import React from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Button from "../../../Button/Button.ts";
import { formTheme } from "../../../../ui/form/constants/theme.ts";
import dayjs from "dayjs";

export function CalendarHeader() {
    const { calendarDate, previousMonthInCalendar, nextMonthInCalendar } = useDatePicker();

    return (
        <Animated.View entering={ FadeIn } exiting={ FadeOut } style={ styles.container }>
            <Button.Icon
                icon={ ICON_NAMES.leftArrowHead }
                iconSize={ FONT_SIZES.h3 }
                iconColor={ COLORS.gray1 }
                width={ FONT_SIZES.h3 / ICON_FONT_SIZE_SCALE }
                height={ FONT_SIZES.h3 / ICON_FONT_SIZE_SCALE }
                backgroundColor="transparent"
                onPress={ previousMonthInCalendar }
            />
            <Text style={ styles.label }>{ dayjs(calendarDate).format("YYYY MMMM") }</Text>
            <Button.Icon
                icon={ ICON_NAMES.rightArrowHead }
                iconSize={ FONT_SIZES.h3 }
                iconColor={ COLORS.gray1 }
                width={ FONT_SIZES.h3 / ICON_FONT_SIZE_SCALE }
                height={ FONT_SIZES.h3 / ICON_FONT_SIZE_SCALE }
                backgroundColor="transparent"
                onPress={ nextMonthInCalendar }/>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    label: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p3,
        color: formTheme.valueTextColor,
        textTransform: "capitalize"
    }
});