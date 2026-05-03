import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { TimelineView } from "../../../../../components/timelineView/TimelineView.tsx";
import { FULL_TABBAR_HEIGHT, SEPARATOR_SIZES } from "../../../../../constants";
import { useServiceLogTimelineFilter } from "../hooks/useServiceLogTimelineFilter.ts";
import { useServiceLogTimelineItem } from "../hooks/useServiceLogTimelineItem.tsx";
import { Title } from "../../../../../components/Title.tsx";
import { useTranslation } from "react-i18next";
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
        filterByRange,
        orderButtons
    } = useTimeline({
        infiniteQueryOptions: memoizedOptions,
        cursorOrderButtons: [
            { field: "e.date", title: t("date.text") },
            { field: "e.amount", title: t("currency.price") }
        ],
        fromDateRangeFilterField: "e.date"
    });

    const { filterButtons } = useServiceLogTimelineFilter({
        filterManager,
        carId,
        carFilterFieldName: "c.id",
        typesFilterFieldName: "st.id"
    });

    const memoizedData = useMemo(() => data.map((row) => mapper(row)), [data, mapper]);

    return (
        <View style={ styles.container }>
            <Title
                title={ t("service.title") }
                containerStyle={ styles.titleContainer }
            />
            <TimelineView
                data={ memoizedData }
                filterByRange={ filterByRange }
                orderButtons={ orderButtons }
                filterButtons={ filterButtons }
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
    titleContainer: {
        flexShrink: 1
    }
});