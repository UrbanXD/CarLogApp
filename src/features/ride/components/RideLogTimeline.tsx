import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useRideLogTimelineItem } from "../hooks/useRideLogTimelineItem.tsx";
import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Title } from "../../../components/Title.tsx";
import { TimelineView } from "../../../components/timelineView/TimelineView.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../constants";
import { YearPicker } from "../../../components/Input/_presets/YearPicker.tsx";
import { sql } from "@powersync/kysely-driver";
import { useTranslation } from "react-i18next";
import { CAR_TABLE } from "../../../database/connector/powersync/tables/car.ts";
import { RawBuilder } from "kysely";
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
        isLoading,
        filterManager,
        orderButtons
    } = useTimeline({
        infiniteQueryOptions: memoizedOptions,
        cursorOrderButtons: [
            { field: "rl.start_time", title: t("rides.start_time") },
            { field: "rl.end_time", title: t("rides.end_time") },
            { field: "distance", title: t("rides.distance") },
            { field: "duration", title: t("rides.duration") },
            { field: "total_expense", title: t("currency.price") }
        ]
    });

    useEffect(() => {
        if(!carId) return;

        filterManager.replaceFilter({
            groupKey: CAR_TABLE,
            filter: { field: "c.id", operator: "=", value: carId }
        });
    }, [carId]);

    const setYearFilter = useCallback((year: string) => {
        // @formatter:off
        const customSql = (fieldRef: string | RawBuilder<any>) => sql<number>`strftime('%Y', ${ fieldRef })`;
        // @formatter:on
        filterManager.replaceFilter({
            groupKey: "year",
            filter: { field: "start_time", operator: "=", value: year, customSql }
        });
    }, [filterManager]);

    const memoizedData = useMemo(() => data.map((row) => mapper(row)), [data, mapper]);

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
                data={ memoizedData }
                orderButtons={ orderButtons }
                isLoading={ isLoading }
                fetchNext={ fetchNext }
                fetchPrev={ fetchPrev }
                isNextFetching={ isNextFetching }
                isPrevFetching={ isPrevFetching }
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