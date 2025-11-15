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

type RideType = {
    carUID: string
    carOwnerUID: string
    dateTitle: string
    dateSubtitle: string
    time: string
    locations: Array<{
        city: string,
        place?: string
    }>
    client: string,
    passengerCount?: number,
    comment?: string
}

type UpcomingRidesProps = {
    car: Car | null
}

export function UpcomingRides({ car }: UpcomingRidesProps) {
    const { rideLogDao } = useDatabase();
    const { mapper } = useRideLogTimelineItem();

    const [rides, setRides] = useState<Array<RideLog>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [today] = useState(dayjs().hour(0).minute(0).second(0));

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
                milestone="Nem található"
                title={ "Hozzalétre a következő útját!" }
                onPress={ openCreateRideLogBottomSheet }
                color={ COLORS.gray2 }
                isFirst
                isLast
            />
        );
    }, []);

    const goToRideLogTab = () => router.push("/(main)/workbook");
    const openCreateRideLogBottomSheet = () => router.push("/ride/create/");

    return (
        <View style={ GLOBAL_STYLE.contentContainer }>
            <View>
                <Text style={ GLOBAL_STYLE.containerTitleText }>
                    Közelgő utak
                </Text>
                <Text style={ GLOBAL_STYLE.containerText }>
                    { today.format("YYYY. MM. DD. - dddd") } (ma)
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
                text="További utak"
                icon={ ICON_NAMES.rightArrowHead }
                onPress={ goToRideLogTab }
            />
        </View>
    );
}