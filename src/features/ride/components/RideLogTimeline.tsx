import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useRideLogTimelineItem } from "../hooks/useRideLogTimelineItem.tsx";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Title } from "../../../components/Title.tsx";
import { TimelineView } from "../../../components/timelineView/TimelineView.tsx";
import { FULL_TABBAR_HEIGHT, SEPARATOR_SIZES } from "../../../constants";
import { useTranslation } from "react-i18next";
import { CAR_TABLE } from "../../../database/connector/powersync/tables/car.ts";
import { useTimeline } from "../../../hooks/useTimeline.ts";

type RideLogTimelineProps = {
    carId: string
};

export function RideLogTimeline({ carId }: RideLogTimelineProps) {
    const { t } = useTranslation();
    const { rideLogDao } = useDatabase();
    const { mapper } = useRideLogTimelineItem();

    const memoizedOptions = useMemo(() => rideLogDao.timelineInfiniteQuery(carId), [rideLogDao]);

    const {
        data,
        fetchNext,
        fetchPrev,
        isNextFetching,
        isPrevFetching,
        hasNext,
        hasPrev,
        isLoading,
        filterManager,
        filterByRange,
        orderButtons
    } = useTimeline({
        infiniteQueryOptions: memoizedOptions,
        cursorOrderButtons: [
            { field: "rl.start_time", title: t("rides.start_time") },
            { field: "rl.end_time", title: t("rides.end_time") },
            { field: "distance", title: t("rides.distance") },
            { field: "duration", title: t("rides.duration") },
            { field: "total_expense", title: t("currency.price") }
        ],
        fromDateRangeFilterField: "rl.start_time",
        toDateRangeFilterField: "rl.end_time"
    });

    useEffect(() => {
        if(!carId) return;

        filterManager.replaceFilter({
            groupKey: CAR_TABLE,
            filter: { field: "c.id", operator: "=", value: carId }
        });
    }, [carId]);

    const memoizedData = useMemo(() => data.map((row) => mapper(row)), [data, mapper]);

    return (
        <View style={ styles.container }>
            <Title
                title={ t("rides.title") }
                containerStyle={ styles.headerTitleContainer }
            />
            <TimelineView
                data={ memoizedData }
                orderButtons={ orderButtons }
                filterByRange={ filterByRange }
                isLoading={ isLoading }
                fetchNext={ fetchNext }
                fetchPrev={ fetchPrev }
                isNextFetching={ isNextFetching }
                isPrevFetching={ isPrevFetching }
                hasNext={ hasNext }
                hasPrev={ hasPrev }
                style={ { paddingBottom: FULL_TABBAR_HEIGHT } }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall
    },
    headerTitleContainer: {
        flexShrink: 1
    }
});