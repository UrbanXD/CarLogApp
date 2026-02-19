import { Pressable, StyleSheet, Text, View } from "react-native";
import dayjs from "dayjs";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES } from "../../../../constants";
import InputDatePicker, { InputDatePickerRef } from "../InputDatePicker.tsx";
import Icon from "../../../Icon.tsx";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "../../../../types";

type RangeDatePickerProps = {
    from: string | null
    to: string | null
    setFrom: Dispatch<SetStateAction<string | null>>
    setTo: Dispatch<SetStateAction<string | null>>
    style?: ViewStyle
}

export function DateRangePicker({ from, to, setFrom, setTo, style }: RangeDatePickerProps) {
    const { t } = useTranslation();

    const datePickerRef = useRef<InputDatePickerRef>(null);

    const openDateRangePicker = () => datePickerRef?.current?.open("calendar");
    const clearRangeDate = () => {
        setFrom(null);
        setTo(null);
    };

    return (
        <View style={ [styles.container, style] }>
            <InputDatePicker
                ref={ datePickerRef }
                mode="range"
                defaultStartDate={ from }
                defaultEndDate={ to }
                hiddenController
                setValue={
                    (date: string | Array<string | null> | null) => {
                        if(Array.isArray(date)) {
                            setFrom(date[0]);
                            setTo(date[1]);
                        }
                    }
                }
            />
            <Pressable onPress={ openDateRangePicker }>
                {
                    from !== null && to !== null
                    ?
                    <View>
                        <View style={ styles.rangeContainer }>
                            <Text style={ styles.rangeText }>
                                { dayjs(from).format("LL") }
                            </Text>
                            <Text style={ styles.arrow }>→</Text>
                            <Text style={ styles.rangeText }>
                                { dayjs(to).format("LL") }
                            </Text>
                        </View>
                        <Text style={ styles.agoText }>
                            { dayjs(from).from(dayjs(to)) }
                        </Text>
                    </View>
                    :
                    <Text style={ styles.rangeText }>
                        { t("date.range_placeholder") }
                    </Text>
                }
            </Pressable>
            {
                from !== null && to !== null &&
               <Icon
                  icon={ ICON_NAMES.close }
                  color={ styles.rangeText.color }
                  size={ styles.rangeText.fontSize * ICON_FONT_SIZE_SCALE }
                  onPress={ clearRangeDate }
               />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    rangeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 2
    },
    rangeText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.white
    },
    arrow: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1
    },
    agoText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4 * 0.85,
        color: COLORS.white
    }
});