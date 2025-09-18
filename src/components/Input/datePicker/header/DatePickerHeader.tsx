import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import React, { useEffect } from "react";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import Icon from "../../../Icon.tsx";
import { DatePickerViews, useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";

export function DatePickerHeader() {
    const { date, currentView, openView } = useDatePicker();

    const view = useSharedValue<DatePickerViews>(currentView);

    useEffect(() => {
        view.value = currentView;
    }, [currentView]);

    const dateArrowRotate = useDerivedValue(() =>
        withTiming(view.value === "wheel_picker" ? -180 : 0, { duration: 200 })
    );
    const timeArrowRotate = useDerivedValue(() =>
        withTiming(view.value === "time" ? -180 : 0, { duration: 200 })
    );

    const dateArrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${ dateArrowRotate.value }deg` }]
    }));

    const timeArrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${ timeArrowRotate.value }deg` }]
    }));

    const onPressDateSelector = () => openView(currentView === "wheel_picker" ? "calendar" : "wheel_picker");
    const onPressTimeSelector = () => openView(currentView === "time" ? "calendar" : "time");

    return (
        <View style={ styles.container }>
            <Pressable onPress={ onPressDateSelector } style={ { flexDirection: "row", alignItems: "center" } }>
                <Icon
                    icon={ ICON_NAMES.calendar }
                    size={ FONT_SIZES.p3 * ICON_FONT_SIZE_SCALE }
                    style={ { marginRight: SEPARATOR_SIZES.lightSmall / 2 } }
                />
                <Text style={ styles.label }>{ date.format("YYYY. MMM D.") }</Text>
                <Animated.View style={ dateArrowStyle }>
                    <Icon
                        icon={ ICON_NAMES.downArrowHead }
                        size={ FONT_SIZES.p4 * ICON_FONT_SIZE_SCALE }
                    />
                </Animated.View>
            </Pressable>
            <Pressable onPress={ onPressTimeSelector } style={ { flexDirection: "row", alignItems: "center" } }>
                <Icon
                    icon={ ICON_NAMES.clock }
                    size={ FONT_SIZES.p3 * ICON_FONT_SIZE_SCALE }
                    style={ { marginRight: SEPARATOR_SIZES.lightSmall / 2 } }
                />
                <Text style={ styles.label }>{ date.format("HH:mm") }</Text>
                <Animated.View style={ timeArrowStyle }>
                    <Icon
                        icon={ ICON_NAMES.downArrowHead }
                        size={ FONT_SIZES.p4 * ICON_FONT_SIZE_SCALE }
                    />
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderColor: COLORS.white2,
        paddingBottom: 5,
        marginBottom: 5,
        borderBottomWidth: 1
    },
    label: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p3,
        color: COLORS.white2,
        textTransform: "capitalize"
    }
});