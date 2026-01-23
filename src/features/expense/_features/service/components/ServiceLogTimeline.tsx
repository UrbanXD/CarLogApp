import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { TimelineView } from "../../../../../components/timelineView/TimelineView.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../../../constants";
import { useServiceLogTimelineFilter } from "../hooks/useServiceLogTimelineFilter.ts";
import { useServiceLogTimelineItem } from "../hooks/useServiceLogTimelineItem.tsx";
import { YearPicker } from "../../../../../components/Input/_presets/YearPicker.tsx";
import { sql } from "@powersync/kysely-driver";
import { Title } from "../../../../../components/Title.tsx";
import { useTranslation } from "react-i18next";
import { RawBuilder } from "kysely";
import { useTimeline } from "../../../../../hooks/useTimeline.ts";

type ServiceLogTimelineProps = {
    carId: string
};

export function ServiceLogTimeline({ carId }: ServiceLogTimelineProps) {
    const { t } = useTranslation();
    const { serviceLogDao } = useDatabase();
    const { mapper } = useServiceLogTimelineItem();

    const memoizedOptions = useMemo(() => serviceLogDao.timelineInfiniteQuery(carId), [serviceLogDao]);

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
            { field: "e.date", title: t("date.text") },
            { field: "e.amount", title: t("currency.price") }
        ]
    });

    const { filterButtons } = useServiceLogTimelineFilter({
        filterManager,
        carId,
        carFilterFieldName: "c.id",
        typesFilterFieldName: "st.id"
    });

    const setYearFilter = useCallback((year: string) => {
        // @formatter:off
        const customSql = (fieldRef: string | RawBuilder<any>) => sql<number>`strftime('%Y', ${ fieldRef })`;
        // @formatter:on

        filterManager.replaceFilter({
            groupKey: "year",
            filter: { field: "e.date", operator: "=", value: year, customSql }
        });
    }, [filterManager]);

    const memoizedData = useMemo(() => data.map((row) => mapper(row)), [data, mapper]);

    return (
        <View style={ styles.container }>
            <View style={ styles.headerContainer }>
                <Title
                    title={ t("service.title") }
                    containerStyle={ styles.titleContainer }
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
                filterButtons={ filterButtons }
                isLoading={ isLoading }
                fetchNext={ fetchNext }
                fetchPrev={ fetchPrev }
                isNextFetching={ isNextFetching }
                isPrevFetching={ isPrevFetching }
                hasNext={ hasNext }
                hasPrev={ hasPrev }
                style={ { paddingBottom: SIMPLE_TABBAR_HEIGHT } }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall
    },
    headerContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "flex-start"
    },
    titleContainer: {
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