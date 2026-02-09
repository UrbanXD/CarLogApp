import { useCallback } from "react";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import { router } from "expo-router";
import { RideLog } from "../schemas/rideLogSchema.ts";
import { COLORS, ICON_NAMES } from "../../../constants";
import dayjs from "dayjs";
import { RideTime } from "../components/RideTime.tsx";
import { useTranslation } from "react-i18next";

export function useRideLogTimelineItem() {
    const { t } = useTranslation();

    const mapper = useCallback((rideLog: RideLog, callback?: () => void): TimelineItemType => {
        const onPress = () => {
            if(!rideLog.id) return;

            callback?.();
            router.push({
                pathname: "/ride/[id]",
                params: { id: rideLog.id, title: t("rides.log") }
            });
        };

        return {
            id: rideLog.id,
            milestone: <RideTime startTime={ dayjs(rideLog.startTime) } endTime={ dayjs(rideLog.endTime) }/>,
            title: rideLog.ridePlaces.map(ridePlace => ridePlace.name).join(" - "),
            icon: ICON_NAMES.road,
            color: COLORS.ride,
            note: rideLog.note,
            footerText: (rideLog.startOdometer && rideLog.endOdometer)
                        ? `${ rideLog.endOdometer.value - rideLog.startOdometer.value } ${ rideLog.endOdometer.unit.short }`
                        : " - ",
            onPress
        };
    }, [t]);

    return { mapper };
}