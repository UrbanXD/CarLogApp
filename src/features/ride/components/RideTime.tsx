import React from "react";
import { StyleSheet, Text, View } from "react-native";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/hu";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";

dayjs.locale("hu");

type RideTimeProps = {
    startTime: Dayjs
    endTime: Dayjs
};

const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    let text = "";

    if(h > 0) text += `${ h } óra`;

    if(h > 0 && m > 0) text += " ";

    if(m > 0) text += `${ m } perc`;

    return text || "néhány másodperc";
};


export function RideTime({
    startTime,
    endTime
}: RideTimeProps) {
    const isSameDay = startTime.isSame(endTime, "day");

    const duration = endTime.diff(startTime, "minute");
    const durationText = (isNaN(duration) || duration === 0) ? null : formatDuration(duration);

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