import { Car } from "../../car/schemas/carSchema.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useRideLogTimelineItem } from "../hooks/useRideLogTimelineItem.tsx";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTimelinePaginator } from "../../../hooks/useTimelinePaginator.ts";
import { RideLogTableRow } from "../../../database/connector/powersync/AppSchema.ts";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import { RideLog } from "../schemas/rideLogSchema.ts";
import { StyleSheet, View } from "react-native";
import { Title } from "../../../components/Title.tsx";
import { TimelineView } from "../../../components/timelineView/TimelineView.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../constants/index.ts";
import { YearPicker } from "../../../components/Input/_presets/YearPicker.tsx";
import { sql } from "@powersync/kysely-driver";

type RideLogTimelineProps = {
    car: Car
};

export function RideLogTimeline({ car }: RideLogTimelineProps) {
    const { rideLogDao } = useDatabase();
    const { mapper } = useRideLogTimelineItem();
    const paginator = useMemo(() =>
        rideLogDao.paginator(
            {
                cursor: [
                    { table: null, field: "total_expense", order: "desc" },
                    { field: "start_time", order: "desc" },
                    { field: "end_time", order: "desc" },
                    { table: null, field: "duration", order: "desc" },
                    { field: "id" }
                ]
            },
            {
                group: "car",
                filters: [{ field: "car_id", operator: "=", value: car.id }]
            }
        ), []);

    const {
        ref,
        data,
        initialFetchHappened,
        isInitialFetching,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching,
        timelineFilterManagement,
        orderButtons
    } = useTimelinePaginator<RideLogTableRow & { total_expense: number }, RideLog, TimelineItemType>({
        paginator,
        mapper,
        cursorOrderButtons: [
            { table: null, field: "total_expense", title: "Ár" },
            { field: "start_time", title: "Indulási idő" },
            { field: "end_time", title: "Érkezési idő" },
            { table: null, field: "duration", title: "Idő hossz" }
        ]
    });

    useEffect(() => {
        if(!car) return;

        timelineFilterManagement.replaceFilter({
            groupKey: "car",
            filter: { field: "car_id", operator: "=", value: car.id }
        });
    }, [car]);

    const setYearFilter = useCallback((year: string) => {
        // @formatter:off
        const customSql = (fieldRef: string) => sql<number>`strftime('%Y', ${ fieldRef })`;
        // @formatter:on
        timelineFilterManagement.replaceFilter({
            groupKey: "year",
            filter: { field: "start_time", operator: "=", value: year, customSql }
        });
    }, [timelineFilterManagement]);

    return (
        <View style={ styles.container }>
            <View style={ styles.headerContainer }>
                <Title
                    title={ "Menetkönyv" }
                    containerStyle={ styles.headerContainer.titleContainer }
                />
                <YearPicker
                    containerStyle={ styles.headerContainer.yearPicker }
                    textInputStyle={ styles.headerContainer.yearPicker.label }
                    inputPlaceholder={ "Év" }
                    hiddenBackground={ true }
                    setValue={ setYearFilter }
                />
            </View>
            <TimelineView
                ref={ ref }
                data={ data }
                orderButtons={ orderButtons }
                isInitialFetching={ isInitialFetching }
                fetchNext={ initialFetchHappened && paginator.hasNext() && fetchNext }
                fetchPrevious={ initialFetchHappened && paginator.hasPrevious() && fetchPrevious }
                isNextFetching={ isNextFetching }
                isPreviousFetching={ isPreviousFetching }
                style={ { paddingBottom: SIMPLE_TABBAR_HEIGHT } }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    headerContainer: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "flex-start",

        titleContainer: {
            flexShrink: 1
        },

        yearPicker: {
            minHeight: 0,
            height: FONT_SIZES.p1,

            label: {
                fontFamily: "Gilroy-Heavy",
                color: COLORS.white
            }
        }
    }
});