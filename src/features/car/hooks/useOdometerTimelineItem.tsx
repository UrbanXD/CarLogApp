import React, { useCallback } from "react";
import { OdometerLog } from "../schemas/odometerLogSchema.ts";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import { OdometerLogType } from "../model/enums/odometerLogType.ts";
import { COLORS, ICON_NAMES } from "../../../constants/index.ts";
import { Alert } from "react-native";
import { OdometerText } from "../components/odometer/OdometerText.tsx";
import dayjs from "dayjs";
import { router } from "expo-router";

export const useOdometerTimelineItem = () => {
    const mapper = useCallback((odometerLog: OdometerLog): TimelineItemType => {
        let title = "Kilométeróra-frissítés";
        let color;
        let icon;
        let onPressInfo;

        switch(odometerLog.type) {
            case OdometerLogType.FUEL:
                title = "Tankolás";
                icon = ICON_NAMES.fuelPump;
                color = COLORS.fuelYellow;
                onPress = () => { Alert.alert("fuelocska"); };
                break;
            case OdometerLogType.SERVICE:
                title = "Szervíz";
                icon = ICON_NAMES.serviceOutline;
                color = COLORS.service;
                onPress = () => Alert.alert(" SZERVIZECSKE ");
                break;
        }

        return {
            id: odometerLog.id,
            milestone: odometerLog.value.toString(),
            renderMilestone: (milestone: string) =>
                <OdometerText
                    text={ milestone }
                    unit={ odometerLog.unit }
                    textStyle={ { color: COLORS.white } }
                    unitTextStyle={ { color: COLORS.white } }
                />,
            title,
            icon,
            color,
            note: odometerLog.note,
            footerText: dayjs(odometerLog.date).format("YYYY. MM DD. hh:mm"),
            onPress
        };
    });

    return { mapper };
};