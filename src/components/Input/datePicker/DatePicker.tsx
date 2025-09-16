import React from "react";
import { StyleSheet, View } from "react-native";
import { DEFAULT_SEPARATOR, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { CalendarPicker } from "./pickerView/CalendarPicker.tsx";
import { WheelDatePicker } from "./pickerView/WheelDatePicker.tsx";
import { useDatePicker } from "../../../contexts/datePicker/DatePickerContext.ts";
import { DatePickerHeader } from "./header/DatePickerHeader.tsx";
import { TimePicker } from "./pickerView/TimePicker.tsx";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { heightPercentageToDP } from "react-native-responsive-screen";

export function DatePicker() {
    const { currentView } = useDatePicker();

    return (
        <View style={ styles.container }>
            <DatePickerHeader/>
            <View style={ styles.viewContainer }>
                {
                    currentView === "calendar" &&
                   <Animated.View entering={ FadeIn } exiting={ FadeOut }>
                      <CalendarPicker/>
                   </Animated.View>
                }
                {
                    currentView === "wheel_picker" &&
                   <Animated.View entering={ FadeIn } exiting={ FadeOut }>
                      <WheelDatePicker/>
                   </Animated.View>
                }
                {
                    currentView === "time" &&
                   <Animated.View entering={ FadeIn } exiting={ FadeOut }>
                      <TimePicker/>
                   </Animated.View>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        padding: DEFAULT_SEPARATOR,
        gap: SEPARATOR_SIZES.small
    },
    viewContainer: {
        flex: 1,
        height: heightPercentageToDP(30)
    }
});