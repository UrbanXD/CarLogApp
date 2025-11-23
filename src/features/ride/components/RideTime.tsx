import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dayjs } from "dayjs";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { secondsToTimeText } from "../../../utils/secondsToTimeDuration.ts";

type RideTimeProps = {
    startTime: Dayjs
    endTime: Dayjs
};

export function RideTime({
    startTime,
    endTime
}: RideTimeProps) {
    const isSameDay = startTime.isSame(endTime, "day");

    const duration = endTime.diff(startTime, "second");
    const durationText = (isNaN(duration) || duration === 0) ? null : secondsToTimeText(duration);

    return (
        <View style={ styles.container }>
            <Text style={ styles.timeText }>
                { startTime.format("YYYY. MM. DD. ddd HH:mm") }
                {
                    isSameDay
                    ? <Text style={ styles.separator }> – </Text>
                    : "\n"
                }
                {
                    isSameDay
                    ? endTime.format("HH:mm")
                    : endTime.format("YYYY. MM. DD. ddd HH:mm")
                }
            </Text>
            {
                durationText &&
               <Text style={ styles.durationText }>
                   { durationText }
               </Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    timeText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2,
        color: COLORS.white
    },
    durationText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        lineHeight: FONT_SIZES.p3,
        color: COLORS.gray1
    },
    separator: {
        color: COLORS.gray1
    }
});