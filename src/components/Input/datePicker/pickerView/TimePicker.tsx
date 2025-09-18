import { useDatePicker } from "../../../../contexts/datePicker/DatePickerContext.ts";
import WheelPicker, {
    PickerItem,
    useOnPickerValueChangedEffect,
    usePickerControl,
    withPickerControl
} from "@quidone/react-native-wheel-picker";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";

const ControlPicker = withPickerControl(WheelPicker);

type ControlPickersMap = {
    hour: { item: PickerItem<number> };
    minute: { item: PickerItem<number> };
};

const hourOptions = Array.from({ length: 24 }).map((_, index) => ({
    value: index,
    label: index.toString().padStart(2, "0")
}));

const minuteOptions = Array.from({ length: 60 }).map((_, index) => ({
    value: index,
    label: index.toString().padStart(2, "0")
}));

export function TimePicker() {
    const { date, setDate } = useDatePicker();

    const pickerControl = usePickerControl<ControlPickersMap>();

    useOnPickerValueChangedEffect(pickerControl, (event) => {
        setDate(prevState => prevState
            .set("hour", event.pickers.hour.item.value)
            .set("minute", event.pickers.minute.item.value)
        );
    });

    return (
        <View style={ styles.container }>
            <View style={ styles.selectedTimeOverlay }/>
            <ControlPicker
                control={ pickerControl }
                pickerName="hour"
                data={ hourOptions }
                value={ date.hour() }
                width="15%"
                itemHeight={ styles.item.height }
                itemTextStyle={ styles.item.text }
                overlayItemStyle={ { backgroundColor: "transparent" } }
                enableScrollByTapOnItem
                visibleItemCount={ 7 }
                scrollEventThrottle={ 16 }
            />
            <Text style={ styles.item.separator }>:</Text>
            <ControlPicker
                control={ pickerControl }
                pickerName="minute"
                data={ minuteOptions }
                value={ date.minute() }
                width="15%"
                itemHeight={ styles.item.height }
                itemTextStyle={ styles.item.text }
                overlayItemStyle={ { backgroundColor: "transparent" } }
                enableScrollByTapOnItem
                visibleItemCount={ 7 }
                scrollEventThrottle={ 16 }
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
        width: "50%",
        height: heightPercentageToDP(5),
        borderRadius: 10
    },
    item: {
        height: heightPercentageToDP(5),

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