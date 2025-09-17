import { DatePickerViews, useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES } from "../../../../constants/index.ts";
import React, { useEffect } from "react";
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import Icon from "../../../Icon.tsx";
import Button from "../../../Button/Button.ts";
import { formTheme } from "../../../../ui/form/constants/theme.ts";

export function DatePickerHeader() {
    const { calendarDate, previousMonthInCalendar, nextMonthInCalendar, currentView, openView } = useDatePicker();

    const view = useSharedValue<DatePickerViews>(currentView);

    const dateArrowRotate = useDerivedValue(() => withTiming(
        view.value === "wheel_picker" ? -180 : 0,
        { duration: 200 }
    ));

    useEffect(() => {
        view.value = currentView;
    }, [currentView]);

    const dateArrowStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${ dateArrowRotate.value }deg` }]
        };
    });

    const onPressDateSelector = () => openView(currentView === "wheel_picker" ? "calendar" : "wheel_picker");

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
            <Pressable onPress={ onPressDateSelector } style={ { flexDirection: "row" } }>
                <Text style={ styles.label }>{ calendarDate.format("YYYY MMMM") }</Text>
                <Animated.View style={ dateArrowStyle }>
                    <Icon
                        icon={ ICON_NAMES.downArrowHead }
                        color={ styles.label.color }
                        size={ styles.label.fontSize * 1.35 }
                    />
                </Animated.View>
            </Pressable>
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