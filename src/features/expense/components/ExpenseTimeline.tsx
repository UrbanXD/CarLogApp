import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useExpenseTimelineItem } from "../hooks/useExepenseTimelineItem.tsx";
import React, { useMemo } from "react";
import { Title } from "../../../components/Title.tsx";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../constants";
import { useTranslation } from "react-i18next";
import { useTimeline } from "../../../hooks/useTimeline.ts";
import { useExpenseTimelineFilter } from "../hooks/useExpenseTimelineFilter.ts";
import { TimelineView } from "../../../components/timelineView/TimelineView.tsx";

type ExpenseTimelineProps = {
    carId: string
};

export function ExpenseTimeline({ carId }: ExpenseTimelineProps) {
    const { t } = useTranslation();
    const { expenseDao } = useDatabase();
    const { mapper } = useExpenseTimelineItem();

    const memoizedOptions = useMemo(() => expenseDao.timelineInfiniteQuery(carId), [expenseDao]);

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
            { field: "expense.date", title: t("date.text") },
            { field: "expense.amount", title: t("currency.price") }
        ]
    });

    const { filterButtons } = useExpenseTimelineFilter({
        filterManager,
        carId,
        carFilterFieldName: "car.id",
        typesFilterFieldName: "type.id"
    });

    const memoizedData = useMemo(() => data.map((row) => mapper(row)), [data, mapper]);

    return (
        <View style={ styles.container }>
            <Title
                title={ t("expenses.title") }
                subtitle={ t("expenses.description") }
            />
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
    }
});