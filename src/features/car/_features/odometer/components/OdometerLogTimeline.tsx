import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { TimelineView } from "../../../../../components/timelineView/TimelineView.tsx";
import React, { useCallback, useMemo } from "react";
import { SEPARATOR_SIZES } from "../../../../../constants";
import { StyleSheet, View } from "react-native";
import { Odometer } from "./Odometer.tsx";
import FloatingActionMenu from "../../../../../ui/floatingActionMenu/components/FloatingActionMenu.tsx";
import { router } from "expo-router";
import { useOdometerTimelineItem } from "../hooks/useOdometerTimelineItem.tsx";
import { Title } from "../../../../../components/Title.tsx";
import { useOdometerLogTimelineFilter } from "../hooks/useOdometerLogTimelineFilter.ts";
import { useTranslation } from "react-i18next";
import { useCar } from "../../../hooks/useCar.ts";
import { useTimeline } from "../../../../../hooks/useTimeline.ts";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";

type OdometerLogTimelineProps = {
    carId: string
};

export function OdometerLogTimeline({ carId }: OdometerLogTimelineProps) {
    const { t } = useTranslation();
    const { odometerLogDao } = useDatabase();
    const { mapper } = useOdometerTimelineItem();

    const { car, isLoading: isCarLoading } = useCar({ carId: carId });

    const memoizedOptions = useMemo(() => odometerLogDao.timelineInfiniteQuery(carId), [odometerLogDao]);

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
        orderButtons
    } = useTimeline({
        infiniteQueryOptions: memoizedOptions,
        cursorOrderButtons: [
            { field: "ol.value", title: t("odometer.value") }
        ]
    });

    const { filterButtons } = useOdometerLogTimelineFilter({
        filterManager,
        carId,
        carFilterFieldName: "c.id",
        typesFilterFieldName: "ol.type_id"
    });

    const openCreateOdometerLog = useCallback(() => router.push({
        pathname: "/odometer/log/create",
        params: { carId: carId }
    }), [carId]);

    const memoizedData = useMemo(() => data.map((row) => mapper(row)), [data, mapper]);

    return (
        <View style={ styles.container }>
            <View style={ styles.titleContainer }>
                {
                    isCarLoading
                    ? <MoreDataLoading/>
                    : car &&
                       <>
                          <Title
                             title={ car.name }
                             subtitle={ `${ car.model.make.name } ${ car.model.name }` }
                          />
                          <Odometer value={ car.odometer.value } unit={ car.odometer.unit.short }/>
                       </>
                }
            </View>
            <TimelineView
                data={ memoizedData }
                orderButtons={ orderButtons }
                filterButtons={ filterButtons }
                isLoading={ isLoading }
                fetchNext={ fetchNext }
                fetchPrev={ fetchPrev }
                isNextFetching={ isNextFetching }
                isPrevFetching={ isPrevFetching }
                hasNext={ hasNext }
                hasPrev={ hasPrev }
            />
            <FloatingActionMenu action={ openCreateOdometerLog }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.medium
    },
    titleContainer: {
        gap: SEPARATOR_SIZES.lightSmall / 2
    }
});