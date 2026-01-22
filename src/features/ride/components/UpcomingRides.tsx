import React, { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { COLORS, GLOBAL_STYLE, ICON_NAMES } from "../../../constants";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useRideLogTimelineItem } from "../hooks/useRideLogTimelineItem.tsx";
import { RideLog } from "../schemas/rideLogSchema.ts";
import { router } from "expo-router";
import { TimelineItem } from "../../../components/timelineView/item/TimelineItem.tsx";
import { MoreDataLoading } from "../../../components/loading/MoreDataLoading.tsx";
import Link from "../../../components/Link.tsx";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import "dayjs/locale/en";
import "dayjs/locale/hu";
import { useWatchedQueryCollection } from "../../../database/hooks/useWatchedQueryCollection.ts";

type UpcomingRidesProps = {
    carId: string
}

export function UpcomingRides({ carId }: UpcomingRidesProps) {
    const { t } = useTranslation();
    const { rideLogDao } = useDatabase();
    const { mapper } = useRideLogTimelineItem();

    const [today] = useState(dayjs().year(2025).month(10).day(13).hour(0).minute(0).second(0).millisecond(0));

    const upcomingRidesQuery = useMemo(() => {
        return rideLogDao.upcomingRideWatchedQueryCollection(carId, today);
    }, [rideLogDao, carId, today]);

    const { data: upcomingRides, isLoading } = useWatchedQueryCollection(upcomingRidesQuery);

    const renderRideLog = (rideLog: RideLog, index: number) => {
        return (
            <TimelineItem
                key={ rideLog.id }
                { ...mapper(rideLog) }
                isFirst={ index === 0 }
                isLast={ false }
            />
        );
    };

    const renderEmptyComponent = useCallback(() => {
        return (
            <TimelineItem
                id="not-found"
                milestone={ t("rides.not_found") }
                title={ t("rides.not_found_upcoming_rides_action_call") }
                onPress={ openCreateRideLogBottomSheet }
                color={ COLORS.gray2 }
                isFirst
                isLast
            />
        );
    }, [t]);

    const goToRideLogTab = () => router.push("/(main)/workbook");
    const openCreateRideLogBottomSheet = () => router.push("/ride/create/");

    return (
        <View style={ GLOBAL_STYLE.contentContainer }>
            <View>
                <Text style={ GLOBAL_STYLE.containerTitleText }>
                    { t("rides.upcoming") }
                </Text>
                <Text style={ GLOBAL_STYLE.containerText }>
                    { today.format("dddd") }, { today.format("LL") } ({ t("date.today") })
                </Text>
            </View>
            {
                isLoading
                ?
                <MoreDataLoading/>
                :
                upcomingRides.length > 0
                ? <View>{ upcomingRides.map(renderRideLog) }</View>
                : renderEmptyComponent()
            }
            <Link
                text={ t("rides.more") }
                icon={ ICON_NAMES.rightArrowHead }
                onPress={ goToRideLogTab }
            />
        </View>
    );
}