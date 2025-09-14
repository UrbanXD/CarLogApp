import { AnimatedPressable } from "../../AnimatedComponents/index.ts";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import React, { useState } from "react";
import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker";
import { Portal } from "@gorhom/portal";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import Button from "../../Button/Button.ts";

function DatePicker() {
    const isExpanded = useSharedValue(true);
    const isAnimating = useSharedValue(false);
    const overlayDisplay = useSharedValue<"flex" | "none">("none");

    const overlayStyle = useAnimatedStyle(() => {
        const opacity = withTiming(
            isExpanded.value ? 0.525 : 0,
            { duration: 400 },
            (finished) => {
                if(finished) {
                    isAnimating.value = false;
                    overlayDisplay.value = isExpanded.value ? "flex" : "none";
                }
            }
        );

        return { opacity, display: overlayDisplay.value };
    });

    const defaultStyles = useDefaultStyles("dark");
    const [selected, setSelected] = useState<DateType>();

    return (
        <Portal hostName={ "Home" }>
            <AnimatedPressable
                // onPress={ close }
                style={ [styles.overlay, overlayStyle] }
            />
            <View style={ styles.buttonsContainer }>
                <DateTimePicker
                    mode="single"
                    date={ selected }
                    onChange={ ({ date }) => setSelected(date) }
                    locale="hu"
                    monthCaptionFormat="full"
                    monthsFormat="full"
                    firstDayOfWeek={ 1 }
                    weekdaysFormat={ "min" }
                    showOutsideDays
                    navigationPosition="around"
                    timePicker
                    containerHeight={ heightPercentageToDP(25) }
                    styles={
                        {
                            ...defaultStyles,
                            header: styles.header,
                            button_next_image: styles.header.navigationButtonImage,
                            button_prev_image: styles.header.navigationButtonImage,
                            time_selector: styles.header.selector,
                            time_selector_label: styles.header.selector.label,
                            year_selector: styles.header.selector,
                            year_selector_label: styles.header.selector.label,
                            month_selector: styles.header.selector,
                            month_selector_label: styles.header.selector.label,
                            weekdays: styles.weekdays,
                            weekday_label: styles.weekdays.label,
                            days: styles.contentBackground,
                            day_cell: styles.days.cell,
                            day_label: styles.days.cell.label,
                            outside_label: [styles.days.cell.label, styles.days.cell.outsideLabel],
                            selected: styles.selected,
                            selected_label: styles.selected.label,
                            today: styles.days.cell.today,
                            months: styles.contentBackground,
                            month: styles.monthYear,
                            month_label: styles.monthAndYear.label,
                            selected_month: styles.selected,
                            selected_month_label: styles.selected.label,
                            years: styles.contentBackground,
                            year: styles.monthAndYear,
                            year_label: styles.monthAndYear.label,
                            selected_year: styles.selected,
                            selected_year_label: styles.selected.label,
                            time_label: styles.time.label,
                            time_selected_indicator: styles.selected
                        }
                    }
                />
                <Button.Text text={ "Mentés" } width={ widthPercentageToDP(85) }
                             onPress={ () => { console.log(selected); } }></Button.Text>
            </View>
        </Portal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
        backgroundColor: COLORS.black
    },
    buttonsContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flex: 1,
        zIndex: 2,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: COLORS.gray5,
        padding: 0,
        paddingBottom: 25,
        // marginBottom: 0,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25
    },
    header: {
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        padding: SEPARATOR_SIZES.lightSmall,
        width: widthPercentageToDP(100),
        backgroundColor: COLORS.black5,

        navigationButtonImage: {
            tintColor: COLORS.white,
            alignSelf: "center"
        },

        selector: {
            borderWidth: 0.75,
            borderColor: COLORS.gray1,
            paddingVertical: SEPARATOR_SIZES.lightSmall / 2,
            paddingHorizontal: SEPARATOR_SIZES.small,
            borderRadius: 25,

            label: {
                fontFamily: "Gilroy-Heavy",
                fontSize: FONT_SIZES.p3,
                color: COLORS.white2,
                textTransform: "capitalize"
            }
        }
    },
    weekdays: {
        backgroundColor: COLORS.gray5,
        borderColor: COLORS.gray1,
        borderBottomWidth: 0.50,

        label: {
            fontFamily: "Gilroy-Medium",
            color: COLORS.gray2,
            textTransform: "capitalize"
        }
    },
    contentBackground: {
        backgroundColor: COLORS.gray5,
        padding: 0,
        margin: 0
    },
    days: {
        cell: {
            borderColor: COLORS.gray4,
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
                borderWidth: 1,
                borderRadius: 0,
                borderColor: COLORS.fuelYellow
            }
        }
    },
    monthAndYear: {
        borderColor: COLORS.gray4,
        borderWidth: 0.25,
        margin: 0,

        label: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p4,
            color: COLORS.white2,
            textTransform: "capitalize",
            padding: 10
        }
    },
    selected: {
        backgroundColor: COLORS.fuelYellow,
        borderRadius: 0,

        label: {
            fontFamily: "Gilroy-Heavy",
            color: COLORS.black5
        }
    },
    time: {
        label: {
            fontFamily: "Gilroy-Heavy",
            color: COLORS.white2
        }
    }
});

export default DatePicker;