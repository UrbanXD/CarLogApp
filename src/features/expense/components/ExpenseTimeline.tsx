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

type ExpenseTimelineProps = {
    car: Car
};

export function ExpenseTimeline({ car }: ExpenseTimelineProps) {
    const { expenseDao } = useDatabase();
    const { mapper } = useExpenseTimelineItem(car.currency);
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
                { field: "car_id", operator: "=", value: car.id }
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
        cursorOrderButtons: [{ field: "date", title: "Dátum" }, { field: "amount", title: "Ár" }]
    });
    const { filterButtons } = useExpenseTimelineFilter({ timelineFilterManagement, car });

    if(!car) return <></>;

    return (
        <View style={ styles.container }>
            <Title
                title={ "Pénzügyek" }
                subtitle={ `Az alábbi pénzügyi naplóban különböző kiadásai szerepelnek mely a kiválasztott autójához tartoznak.` }
            />
            <TimelineView
                ref={ ref }
                data={ data }
                orderButtons={ orderButtons }
                filterButtons={ filterButtons }
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
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall
    }
});