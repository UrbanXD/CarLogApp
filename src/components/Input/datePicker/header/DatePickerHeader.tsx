import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import React, { useEffect } from "react";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import Icon from "../../../Icon.tsx";
import { DatePickerViews, useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

type DatePickerHeaderProps = {
    title?: string
    showTimestamps?: boolean
}

export function DatePickerHeader({ title, showTimestamps }: DatePickerHeaderProps) {
    const { t } = useTranslation();
    const { mode, startDate, setStartDate, endDate, setEndDate, currentView, openView } = useDatePicker();

    const view = useSharedValue<DatePickerViews>(currentView);

    useEffect(() => {
        view.value = currentView;
    }, [currentView]);

    const leftDateArrowRotate = useDerivedValue(() =>
        withTiming(view.value === "start_date_picker" ? -180 : 0, { duration: 200 })
    );
    const rightDateArrowRotate = useDerivedValue(() =>
        withTiming(view.value === "time" || view.value === "end_date_picker" ? -180 : 0, { duration: 200 })
    );

    const leftDateArrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${ leftDateArrowRotate.value }deg` }]
    }));

    const rightDateArrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${ rightDateArrowRotate.value }deg` }]
    }));

    const onPressStartDateSelector = () => openView(
        currentView === "start_date_picker"
        ? "calendar"
        : "start_date_picker"
    );
    const onPressEndDateSelector = () => openView(currentView === "end_date_picker" ? "calendar" : "end_date_picker");
    const onPressTimeSelector = () => openView(currentView === "time" ? "calendar" : "time");

    const getRangeLabel = (value: number, unit: dayjs.QUnitType) => {
        return dayjs().to(dayjs().subtract(value, unit), true);
    };

    const timestamp = (type: "month" | "quarter" | "halfYear" | "year") => {
        const now = dayjs();
        setEndDate(now.toDate());

        switch(type) {
            case "year":
                setStartDate(now.subtract(1, "year").toDate());
                break;
            case "halfYear":
                setStartDate(now.subtract(6, "month").toDate());
                break;
            case "quarter":
                setStartDate(now.subtract(1, "quarter").toDate());
                break;
            case "month":
                setStartDate(now.subtract(1, "month").toDate());
        }
    };

    return (
        <View style={ styles.container }>
            {
                title &&
               <Text style={ styles.title }>{ title }</Text>
            }
            {
                mode === "range" &&
               <View style={ styles.buttonContainer }>
                  <Pressable onPress={ onPressStartDateSelector }
                             style={ { flexDirection: "row", alignItems: "center" } }>
                     <Icon
                        icon={ ICON_NAMES.calendar }
                        size={ FONT_SIZES.p3 * ICON_FONT_SIZE_SCALE }
                        style={ { marginRight: SEPARATOR_SIZES.lightSmall / 2 } }
                     />
                     <Text style={ styles.label }>
                         { startDate ? dayjs(startDate).format("L") : t("form.date_picker.date_placeholder") }
                     </Text>
                     <Animated.View style={ leftDateArrowStyle }>
                        <Icon
                           icon={ ICON_NAMES.downArrowHead }
                           size={ FONT_SIZES.p4 * ICON_FONT_SIZE_SCALE }
                        />
                     </Animated.View>
                  </Pressable>
                  <Pressable
                     onPress={ onPressEndDateSelector }
                     style={ { flexDirection: "row-reverse", alignItems: "center", flexShrink: 1 } }
                  >
                     <Icon
                        icon={ ICON_NAMES.calendar }
                        size={ FONT_SIZES.p3 * ICON_FONT_SIZE_SCALE }
                        style={ { marginLeft: SEPARATOR_SIZES.lightSmall / 2 } }
                     />
                     <Text numberOfLines={ 1 } adjustsFontSizeToFit style={ styles.label }>
                         { endDate ? dayjs(endDate).format("L") : t("form.date_picker.date_placeholder") }
                     </Text>
                     <Animated.View style={ rightDateArrowStyle }>
                        <Icon
                           icon={ ICON_NAMES.downArrowHead }
                           size={ FONT_SIZES.p4 * ICON_FONT_SIZE_SCALE }
                        />
                     </Animated.View>
                  </Pressable>
               </View>
            }
            {
                mode === "single" &&
               <View style={ styles.buttonContainer }>
                  <Pressable onPress={ onPressStartDateSelector }
                             style={ { flexDirection: "row", alignItems: "center" } }>
                     <Icon
                        icon={ ICON_NAMES.calendar }
                        size={ FONT_SIZES.p3 * ICON_FONT_SIZE_SCALE }
                        style={ { marginRight: SEPARATOR_SIZES.lightSmall / 2 } }
                     />
                     <Text style={ styles.label }>{ startDate ? dayjs(startDate).format("L") : t(
                         "form.date_picker.date_placeholder") }</Text>
                     <Animated.View style={ leftDateArrowStyle }>
                        <Icon
                           icon={ ICON_NAMES.downArrowHead }
                           size={ FONT_SIZES.p4 * ICON_FONT_SIZE_SCALE }
                        />
                     </Animated.View>
                  </Pressable>
                  <Pressable
                     onPress={ onPressTimeSelector }
                     style={ { flexDirection: "row-reverse", alignItems: "center", flexShrink: 1 } }
                  >
                     <Icon
                        icon={ ICON_NAMES.clock }
                        size={ FONT_SIZES.p3 * ICON_FONT_SIZE_SCALE }
                        style={ { marginLeft: SEPARATOR_SIZES.lightSmall / 2 } }
                     />
                     <Text numberOfLines={ 1 } adjustsFontSizeToFit style={ styles.label }>
                         { startDate ? dayjs(startDate).format("LT") : t("form.date_picker.date_placeholder") }
                     </Text>
                     <Animated.View style={ rightDateArrowStyle }>
                        <Icon
                           icon={ ICON_NAMES.downArrowHead }
                           size={ FONT_SIZES.p4 * ICON_FONT_SIZE_SCALE }
                        />
                     </Animated.View>
                  </Pressable>
               </View>
            }
            {
                mode === "range" && showTimestamps &&
               <View style={ styles.rangeTimestampContainer }>
                  <Text style={ styles.rangeText } onPress={ () => timestamp("month") }>
                      { getRangeLabel(1, "month") }
                  </Text>
                  <Text style={ styles.rangeText } onPress={ () => timestamp("quarter") }>
                      { getRangeLabel(1, "quarter") }
                  </Text>
                  <Text style={ styles.rangeText } onPress={ () => timestamp("halfYear") }>
                      { getRangeLabel(6, "month") }
                  </Text>
                  <Text style={ styles.rangeText } onPress={ () => timestamp("year") }>
                      { getRangeLabel(1, "year") }
                  </Text>
               </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall,
        borderBottomWidth: 1,
        borderColor: COLORS.white2,
        paddingBottom: SEPARATOR_SIZES.lightSmall,
        marginBottom: SEPARATOR_SIZES.lightSmall
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        overflow: "hidden"
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center"
    },
    label: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p3,
        color: COLORS.white2,
        textTransform: "capitalize",
        flexShrink: 1,
        minWidth: 0
    },
    rangeTimestampContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall
    },
    rangeText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4 * 0.9,
        color: COLORS.gray1
    }
});