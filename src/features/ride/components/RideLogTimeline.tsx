import { Car } from "../../car/schemas/carSchema.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useRideLogTimelineItem } from "../hooks/useRideLogTimelineItem.tsx";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTimelinePaginator } from "../../../hooks/useTimelinePaginator.ts";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import { RideLog } from "../schemas/rideLogSchema.ts";
import { StyleSheet, View } from "react-native";
import { Title } from "../../../components/Title.tsx";
import { TimelineView } from "../../../components/timelineView/TimelineView.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../constants/index.ts";
import { YearPicker } from "../../../components/Input/_presets/YearPicker.tsx";
import { sql } from "@powersync/kysely-driver";
import { useTranslation } from "react-i18next";
import { CAR_TABLE } from "../../../database/connector/powersync/tables/car.ts";
import { PaginatorSelectRideLogTableRow } from "../model/dao/rideLogDao.ts";
import { RawBuilder } from "kysely";

type RideLogTimelineProps = {
    car: Car
};

export function RideLogTimeline({ car }: RideLogTimelineProps) {
    const { t } = useTranslation();
    const { rideLogDao } = useDatabase();
    const { mapper } = useRideLogTimelineItem();
    const paginator = useMemo(() =>
        rideLogDao.paginator(
            {
                cursor: [
                    { field: "start_time", order: "desc" },
                    { field: "end_time", order: "desc" },
                    { table: null, field: "distance", order: "desc" },
                    { table: null, field: "duration", order: "desc" },
                    { table: null, field: "total_expense", order: "desc" },
                    { field: "id" }
                ]
            },
            {
                group: CAR_TABLE,
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
    } = useTimelinePaginator<PaginatorSelectRideLogTableRow, RideLog, TimelineItemType>({
        paginator,
        mapper,
        cursorOrderButtons: [
            { field: "start_time", title: t("rides.start_time") },
            { field: "end_time", title: t("rides.end_time") },
            { table: null, field: "distance", title: t("rides.distance") },
            { table: null, field: "duration", title: t("rides.duration") },
            { table: null, field: "total_expense", title: t("currency.price") }
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
        const customSql = (fieldRef: string | RawBuilder<any>) => sql<number>`strftime('%Y', ${ fieldRef })`;
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
                    title={ t("rides.title") }
                    containerStyle={ styles.headerTitleContainer }
                />
                <YearPicker
                    containerStyle={ styles.yearPicker }
                    textInputStyle={ styles.yearPickerLabel }
                    inputPlaceholder={ t("date.year") }
                    hiddenBackground={ true }
                    setValue={ setYearFilter }
                />
            </View>
            <TimelineView
                ref={ ref }
                data={ data }
                orderButtons={ orderButtons }
                isInitialFetching={ isInitialFetching }
                fetchNext={ (initialFetchHappened && paginator.hasNext()) ? fetchNext : undefined }
                fetchPrevious={ (initialFetchHappened && paginator.hasPrevious()) ? fetchPrevious : undefined }
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
        alignItems: "flex-start"
    },
    headerTitleContainer: {
        flexShrink: 1
    },
    yearPicker: {
        minHeight: 0,
        height: FONT_SIZES.p1
    },
    yearPickerLabel: {
        fontFamily: "Gilroy-Heavy",
        color: COLORS.white
    }
});