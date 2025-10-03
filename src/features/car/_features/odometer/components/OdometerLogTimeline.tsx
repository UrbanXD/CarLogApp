import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { TimelineView } from "../../../../../components/timelineView/TimelineView.tsx";
import React, { useCallback, useEffect, useMemo } from "react";
import { SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import { StyleSheet, View } from "react-native";
import useCars from "../../../hooks/useCars.ts";
import { Odometer } from "./Odometer.tsx";
import FloatingActionMenu from "../../../../../ui/floatingActionMenu/components/FloatingActionMenu.tsx";
import { router } from "expo-router";
import { useOdometerTimelineItem } from "../hooks/useOdometerTimelineItem.tsx";
import { Title } from "../../../../../components/Title.tsx";
import { useTimelinePaginator } from "../../../../../hooks/useTimelinePaginator.ts";
import { OdometerLogTableRow } from "../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLog } from "../../../schemas/odometerLogSchema.ts";
import { useOdometerLogTimelineFilter } from "../hooks/useOdometerLogTimelineFilter.ts";

type OdometerLogTimelineProps = {
    carId: string
};

export function OdometerLogTimeline({ carId }: OdometerLogTimelineProps) {
    const { odometerLogDao } = useDatabase();
    const { getCar } = useCars();
    const { mapper } = useOdometerTimelineItem();

    const car = useMemo(() => getCar(carId), [carId, getCar]);
    const paginator = useMemo(() => odometerLogDao.paginator({
        field: ["value", "date", "id"],
        order: ["desc", "desc", "asc"]
    }, { field: "car_id", operator: "=", value: car.id }, 15), []);

    const { typeFilter, filterButtons } = useOdometerLogTimelineFilter();
    const {
        data,
        isInitialFetching,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching,
        setFilter,
        removeFilter,
        orderButtons
    } = useTimelinePaginator<OdometerLogTableRow, OdometerLog>({
        paginator,
        mapper,
        cursorOrderButtons: [{ field: "value", title: "Kilométeróra-állás" }]
    });

    useEffect(() => {
        setFilter("car_id", "=", car?.id);
    }, [car]);

    useEffect(() => {
        if(!typeFilter) return removeFilter("type_id");

        setFilter("type_id", "=", typeFilter);
    }, [typeFilter]);

    if(!car) return <></>;

    const openCreateOdometerLog = useCallback(() => router.push("/bottomSheet/createOdometerLog"), []);

    return (
        <View style={ styles.container }>
            <View style={ styles.titleContainer }>
                <Title
                    title={ car.name }
                    subtitle={ `${ car.model.make.name } ${ car.model.name }` }
                />
                <Odometer value={ car.odometer.value } unit={ car.odometer.unit.short }/>
            </View>
            <TimelineView
                data={ data }
                orderButtons={ orderButtons }
                filterButtons={ filterButtons }
                isInitialFetching={ isInitialFetching }
                fetchNext={ paginator.hasNext() && fetchNext }
                fetchPrevious={ paginator.hasPrevious() && fetchPrevious }
                isNextFetching={ isNextFetching }
                isPreviousFetching={ isPreviousFetching }
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