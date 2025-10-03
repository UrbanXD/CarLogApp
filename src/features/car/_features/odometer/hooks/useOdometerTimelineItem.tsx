import React, { useCallback } from "react";
import { TimelineItemType } from "../../../../../components/timelineView/item/TimelineItem.tsx";
import { COLORS } from "../../../../../constants/index.ts";
import { OdometerText } from "../components/OdometerText.tsx";
import dayjs from "dayjs";
import { router } from "expo-router";
import { OdometerLog } from "../schemas/odometerLogSchema.ts";

export const useOdometerTimelineItem = () => {
    const mapper = useCallback((odometerLog: OdometerLog): TimelineItemType => {
        let onPress = () => router.push({
            pathname: "/odometer/log/[id]",
            params: { id: odometerLog.id }
        });

        return {
            id: odometerLog.id,
            milestone: odometerLog.value.toString(),
            renderMilestone: (milestone: string) =>
                <OdometerText
                    text={ milestone }
                    unit={ odometerLog.unit.short }
                    textStyle={ { color: COLORS.white } }
                    unitTextStyle={ { color: COLORS.white } }
                />,
            title: odometerLog.type.locale,
            icon: odometerLog.type.icon,
            color: odometerLog.type.primaryColor ?? undefined,
            iconColor: odometerLog.type.secondaryColor ?? undefined,
            note: odometerLog.note,
            footerText: dayjs(odometerLog.date).format("YYYY. MM DD. HH:mm"),
            onPress
        };
    });

    return { mapper };
};