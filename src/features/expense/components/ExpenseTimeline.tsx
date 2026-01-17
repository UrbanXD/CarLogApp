import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useExpenseTimelineItem } from "../hooks/useExepenseTimelineItem.tsx";
import React, { useMemo } from "react";
import { TimelineView } from "../../../components/timelineView/TimelineView.tsx";
import { Title } from "../../../components/Title.tsx";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../constants/index.ts";
import { useTimelinePaginator } from "../../../hooks/useTimelinePaginator.ts";
import { Expense } from "../schemas/expenseSchema.ts";
import { Car } from "../../car/schemas/carSchema.ts";
import { useExpenseTimelineFilter } from "../hooks/useExpenseTimelineFilter.ts";
import { SelectExpenseTableRow } from "../model/mapper/expenseMapper.ts";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import { useTranslation } from "react-i18next";
import { CAR_TABLE } from "../../../database/connector/powersync/tables/car.ts";

type ExpenseTimelineProps = {
    car: Car
};

export function ExpenseTimeline({ car }: ExpenseTimelineProps) {
    const { t } = useTranslation();
    const { expenseDao } = useDatabase();
    const { mapper } = useExpenseTimelineItem();
    const paginator = useMemo(
        () =>
            expenseDao.paginator(
                {
                    cursor: [
                        { field: "date", order: "desc" },
                        { field: "amount", order: "desc" },
                        { field: "id" }
                    ]
                },
                {
                    group: CAR_TABLE,
                    filters: [{ field: "car_id", operator: "=", value: car.id }]
                }
            ),
        []
    );

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
    } = useTimelinePaginator<SelectExpenseTableRow, Expense, TimelineItemType>({
        paginator,
        mapper,
        cursorOrderButtons: [{ field: "date", title: t("date.text") }, { field: "amount", title: t("currency.price") }]
    });
    const { filterButtons } = useExpenseTimelineFilter({ timelineFilterManagement, car });

    if(!car) return <></>;

    return (
        <View style={ styles.container }>
            <Title
                title={ t("expenses.title") }
                subtitle={ t("expenses.description") }
            />
            <TimelineView
                ref={ ref }
                data={ data }
                orderButtons={ orderButtons }
                filterButtons={ filterButtons }
                isInitialFetching={ isInitialFetching }
                fetchNext={ initialFetchHappened && paginator.hasNext() ? fetchNext : undefined }
                fetchPrevious={ initialFetchHappened && paginator.hasPrevious() ? fetchPrevious : undefined }
                isNextFetching={ isNextFetching }
                isPreviousFetching={ isPreviousFetching }
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