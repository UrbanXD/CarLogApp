import WheelPicker, {
    PickerItem,
    useOnPickerValueChangedEffect,
    usePickerControl,
    withPickerControl
} from "@quidone/react-native-wheel-picker";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import dayjs from "dayjs";

const ControlPicker = withPickerControl(WheelPicker);

type ControlPickersMap = {
    hour: { item: PickerItem<number> }
    minute: { item: PickerItem<number> }
    amPm?: { item: PickerItem<string> }
};

const minuteOptions = Array.from({ length: 60 }).map((_, index) => ({
    value: index,
    label: index.toString().padStart(2, "0")
}));

const amPmOptions = [
    { value: "AM", label: dayjs().hour(0).format("A") }, // Lekérjük a '0' óra szerinti AM/PM címkét
    { value: "PM", label: dayjs().hour(12).format("A") } // Lekérjük a '12' óra szerinti AM/PM címkét
];

type TimePickerProps = {
    date: Date,
    setDate: (date: Date | null) => void
}

export function TimePicker({ date, setDate }: TimePickerProps) {
    const is12HourFormat = dayjs().localeData().longDateFormat("LT").includes("A");

    const hourOptions =
        is12HourFormat
        ? Array.from({ length: 12 }).map((_, index) => {
            const displayHour = index === 0 ? 12 : index; // 0 -> 12
            return {
                value: index, // 0-11 when 12hour format
                label: displayHour.toString().padStart(2, "0")
            };
        })
        : Array.from({ length: 24 }).map((_, index) => ({
            value: index, // 0-23
            label: index.toString().padStart(2, "0")
        }));

    const pickerControl = usePickerControl<ControlPickersMap>();

    useOnPickerValueChangedEffect(pickerControl, (event) => {
        const selectedHourIndex = event.pickers.hour.item.value;
        const selectedMinute = event.pickers.minute.item.value;

        let newHour24;

        if(is12HourFormat) {
            const selectedAmPm = event.pickers.amPm.item.value;

            if(selectedHourIndex === 0 && selectedAmPm === "AM") newHour24 = 0;      // 12 AM
            else if(selectedHourIndex === 0 && selectedAmPm === "PM") newHour24 = 12; // 12 PM
            else if(selectedAmPm === "PM") newHour24 = selectedHourIndex + 12;
            else newHour24 = selectedHourIndex;
        } else {
            newHour24 = selectedHourIndex;
        }

        setDate(prev =>
            dayjs(prev)
            .set("hour", newHour24)
            .set("minute", selectedMinute)
            .toDate()
        );
    });

    const styles = useStyles(is12HourFormat);

    return (
        <View style={ styles.container }>
            <View style={ styles.selectedTimeOverlay }/>
            <ControlPicker
                control={ pickerControl }
                pickerName="hour"
                data={ hourOptions }
                value={ is12HourFormat ? dayjs(date).hour() % 12 : dayjs(date).hour() }
                width="15%"
                itemHeight={ styles.item.height }
                itemTextStyle={ styles.item.text }
                overlayItemStyle={ { backgroundColor: "transparent" } }
                // enableScrollByTapOnItem
                visibleItemCount={ 7 }
                scrollEventThrottle={ 16 }
            />
            <Text style={ styles.item.separator }>:</Text>
            <ControlPicker
                control={ pickerControl }
                pickerName="minute"
                data={ minuteOptions }
                value={ dayjs(date).minute() }
                width="15%"
                itemHeight={ styles.item.height }
                itemTextStyle={ styles.item.text }
                overlayItemStyle={ { backgroundColor: "transparent" } }
                // enableScrollByTapOnItem
                visibleItemCount={ 7 }
                scrollEventThrottle={ 16 }
            />
            {
                is12HourFormat &&
               <ControlPicker
                  control={ pickerControl }
                  pickerName="amPm"
                  data={ amPmOptions }
                  value={ dayjs(date).hour() >= 12 ? "PM" : "AM" }
                  width="15%"
                  itemHeight={ styles.item.height }
                  itemTextStyle={ styles.item.text }
                  overlayItemStyle={ { backgroundColor: "transparent" } }
                   // enableScrollByTapOnItem
                  visibleItemCount={ 7 }
                  scrollEventThrottle={ 16 }
               />
            }
        </View>
    );
}

const useStyles = (is12HourFormat: boolean) => StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        gap: SEPARATOR_SIZES.small
    },
    selectedTimeOverlay: {
        position: "absolute",
        backgroundColor: COLORS.white2,
        opacity: 0.10,
        alignSelf: "center",
        width: is12HourFormat ? "75%" : "50%",
        height: 2.5 * FONT_SIZES.p2,
        borderRadius: 10
    },
    item: {
        height: 2.5 * FONT_SIZES.p2,

        text: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            color: COLORS.white2
        },

        separator: { // : between hour : minute
            fontFamily: "Gilroy-Medium",
            color: COLORS.white2,
            fontSize: FONT_SIZES.p1,
            alignSelf: "center",
            lineHeight: FONT_SIZES.p2 * 1.25
        }
    }
});