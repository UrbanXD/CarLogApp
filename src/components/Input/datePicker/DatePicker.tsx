import React from "react";
import { StyleSheet, View } from "react-native";
import { CalendarPicker } from "./pickerView/CalendarPicker.tsx";
import { WheelDatePicker } from "./pickerView/WheelDatePicker.tsx";
import { useDatePicker } from "../../../contexts/datePicker/DatePickerContext.ts";
import { TimePicker } from "./pickerView/TimePicker.tsx";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { CalendarHeader } from "./header/CalendarHeader.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";

export function DatePicker() {
    const { startDate, setStartDate, endDate, setEndDate, currentView } = useDatePicker();

    return (
        <View style={ styles.container }>
            {
                currentView === "calendar" &&
               <CalendarHeader/>
            }
            <View style={ styles.viewContainer }>
                {
                    currentView === "calendar" &&
                   <Animated.View entering={ FadeIn } exiting={ FadeOut }>
                      <CalendarPicker/>
                   </Animated.View>
                }
                {
                    currentView === "start_date_picker" &&
                   <Animated.View entering={ FadeIn } exiting={ FadeOut }>
                      <WheelDatePicker date={ startDate } setDate={ setStartDate }/>
                   </Animated.View>
                }
                {
                    currentView === "end_date_picker" &&
                   <Animated.View entering={ FadeIn } exiting={ FadeOut }>
                      <WheelDatePicker date={ endDate } setDate={ setEndDate }/>
                   </Animated.View>
                }
                {
                    currentView === "time" &&
                   <Animated.View entering={ FadeIn } exiting={ FadeOut }>
                      <TimePicker date={ startDate } setDate={ setStartDate }/>
                   </Animated.View>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: "100%",
        height: heightPercentageToDP(28),
        gap: 5
    },
    viewContainer: {
        flex: 1,
        justifyContent: "center"
    }
});