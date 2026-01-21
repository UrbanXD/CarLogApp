import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { TimelineView } from "../../../../../components/timelineView/TimelineView.tsx";
import React, { useCallback, useMemo } from "react";
import { SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import { StyleSheet, View } from "react-native";
import { Odometer } from "./Odometer.tsx";
import FloatingActionMenu from "../../../../../ui/floatingActionMenu/components/FloatingActionMenu.tsx";
import { router } from "expo-router";
import { useOdometerTimelineItem } from "../hooks/useOdometerTimelineItem.tsx";
import { Title } from "../../../../../components/Title.tsx";
import { useTimelinePaginator } from "../../../../../hooks/useTimelinePaginator.ts";
import { useOdometerLogTimelineFilter } from "../hooks/useOdometerLogTimelineFilter.ts";
import { TimelineItemType } from "../../../../../components/timelineView/item/TimelineItem.tsx";
import { useTranslation } from "react-i18next";
import { CAR_TABLE } from "../../../../../database/connector/powersync/tables/car.ts";
import { SelectOdometerLogTableRow } from "../model/dao/OdometerLogDao.ts";
import { OdometerLog } from "../schemas/odometerLogSchema.ts";
import { useCar } from "../../../hooks/useCar.ts";

type OdometerLogTimelineProps = {
    carId: string
};

export function OdometerLogTimeline({ carId }: OdometerLogTimelineProps) {
    const { t } = useTranslation();
    const { odometerLogDao } = useDatabase();
    const { mapper } = useOdometerTimelineItem();

    const { car, isLoading } = useCar({ carId: carId });

    const paginator = useMemo(
        () =>
            odometerLogDao.paginator(
                {
                    cursor: [
                        { field: "value", order: "desc" },
                        { field: "id" }
                    ]
                },
                {
                    group: CAR_TABLE,
                    filters: [{ field: "car_id", operator: "=", value: carId }]
                }
            ),
        [carId]
    );

    const {
        ref,
        data,
        isInitialFetching,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching,
        timelineFilterManagement,
        orderButtons
    } = useTimelinePaginator<SelectOdometerLogTableRow, OdometerLog, TimelineItemType>({
        paginator,
        mapper,
        cursorOrderButtons: [{ field: "value", title: t("odometer.value") }]
    });
    const { filterButtons } = useOdometerLogTimelineFilter({ timelineFilterManagement, carId });

    const openCreateOdometerLog = useCallback(() => router.push({
        pathname: "/odometer/log/create",
        params: { carId: carId }
    }), [carId]);

    return (
        <View style={ styles.container }>
            <View style={ styles.titleContainer }>
                {
                    car && !isLoading &&
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
                ref={ ref }
                data={ data }
                orderButtons={ orderButtons }
                filterButtons={ filterButtons }
                isInitialFetching={ isInitialFetching }
                fetchNext={ paginator.hasNext() ? fetchNext : undefined }
                fetchPrevious={ paginator.hasPrevious() ? fetchPrevious : undefined }
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