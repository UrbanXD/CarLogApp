import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { COLORS, GLOBAL_STYLE, ICON_NAMES } from "../../../constants/index.ts";
import { Car } from "../../car/schemas/carSchema.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useRideLogTimelineItem } from "../hooks/useRideLogTimelineItem.tsx";
import { RideLog } from "../schemas/rideLogSchema.ts";
import { router, useFocusEffect } from "expo-router";
import { TimelineItem } from "../../../components/timelineView/item/TimelineItem.tsx";
import { MoreDataLoading } from "../../../components/loading/MoreDataLoading.tsx";
import Link from "../../../components/Link.tsx";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import "dayjs/locale/en";
import "dayjs/locale/hu";

type UpcomingRidesProps = {
    car: Car | null
}

export function UpcomingRides({ car }: UpcomingRidesProps) {
    const { t, i18n } = useTranslation();
    const { rideLogDao } = useDatabase();
    const { mapper } = useRideLogTimelineItem();

    const [rides, setRides] = useState<Array<RideLog>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [today] = useState(dayjs().hour(0).minute(0).second(0).toDate());

    useFocusEffect(
        useCallback(() => {
            if(!car) return;

            setIsLoading(true);
            rideLogDao.getUpcomingRides(car.id, today.toISOString()).then(result => {
                setIsLoading(false);
                setRides(result);
            });
        }, [car])
    );

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
                    { dayjs(today).format("dddd") }, { dayjs(today).format("LL") } ({ t("date.today") })
                </Text>
            </View>
            {
                isLoading
                ?
                <MoreDataLoading/>
                :
                rides.length > 0
                ? <View>{ rides.map(renderRideLog) }</View>
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