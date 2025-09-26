import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useExpenseTimelineItem } from "../hooks/useExepenseTimelineItem.ts";
import React, { useMemo } from "react";
import { TimelineView } from "../../../components/timelineView/TimelineView.tsx";
import { Title } from "../../../components/Title.tsx";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../constants/index.ts";
import { useTimelinePaginator } from "../../../hooks/useTimelinePaginator.ts";
import { ExpenseTableRow } from "../../../database/connector/powersync/AppSchema.ts";
import { Expense } from "../schemas/expenseSchema.ts";
import { Car } from "../../car/schemas/carSchema.ts";

type ExpenseTimelineProps = {
    car: Car
};

export function ExpenseTimeline({ car }: ExpenseTimelineProps) {
    const { expenseDao } = useDatabase();
    const { mapper } = useExpenseTimelineItem();

    const paginator = useMemo(() => expenseDao.paginator(car.id, 25), [car]);

    const {
        data,
        initialFetchHappened,
        isInitialFetching,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching
    } = useTimelinePaginator<ExpenseTableRow, Expense>({ paginator, mapper });

    if(!car) return <></>;

    return (
        <View style={ styles.container }>
            <Title
                title={ "Pénzügyek" }
                subtitle={ `Az alábbi pénzügyi naplóban különböző kiadásai szerepelnek mely a kiválasztott autójához tartoznak.` }
            />
            <TimelineView
                data={ data }
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
        gap: SEPARATOR_SIZES.small
    }
});