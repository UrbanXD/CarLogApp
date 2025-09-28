import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useExpenseTimelineItem } from "../hooks/useExepenseTimelineItem.ts";
import React, { useEffect, useMemo } from "react";
import { TimelineView } from "../../../components/timelineView/TimelineView.tsx";
import { Title } from "../../../components/Title.tsx";
import { StyleSheet, View } from "react-native";
import { DEFAULT_SEPARATOR, SIMPLE_HEADER_HEIGHT, SIMPLE_TABBAR_HEIGHT } from "../../../constants/index.ts";
import { useTimelinePaginator } from "../../../hooks/useTimelinePaginator.ts";
import { ExpenseTableRow } from "../../../database/connector/powersync/AppSchema.ts";
import { Expense } from "../schemas/expenseSchema.ts";
import { Car } from "../../car/schemas/carSchema.ts";
import { FilterRow } from "../../../components/filter/FilterRow.tsx";
import { FilterButton } from "../../../components/filter/FilterButton.tsx";
import { useExpenseTimelineFilter } from "../hooks/useExpenseTimelineFilter.ts";
import { useExpenseTimelineCursorOptions } from "../hooks/useExpenseTimelineCursorOptions.ts";

type ExpenseTimelineProps = {
    car: Car
};

export function ExpenseTimeline({ car }: ExpenseTimelineProps) {
    const { expenseDao } = useDatabase();
    const { mapper } = useExpenseTimelineItem();
    const paginator = useMemo(() => expenseDao.paginator({
        field: ["date", "amount", "id"],
        order: ["desc", "desc", "asc"]
    }, { field: "car_id", operator: "=", value: car.id }, 25), []);

    const { typeFilter, filterButtons } = useExpenseTimelineFilter();
    const {
        data,
        initialFetchHappened,
        isInitialFetching,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching,
        setFilter,
        removeFilter,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField
    } = useTimelinePaginator<ExpenseTableRow, Expense>({ paginator, mapper });

    const { orderButtons } = useExpenseTimelineCursorOptions({
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField
    });

    useEffect(() => {
        setFilter("car_id", "=", car.id);
    }, [car]);

    useEffect(() => {
        if(!typeFilter) return removeFilter("type_id");

        setFilter("type_id", "=", typeFilter.id);
    }, [typeFilter]);

    if(!car) return <></>;

    return (
        <View style={ styles.container }>
            <Title
                title={ "Pénzügyek" }
                subtitle={ `Az alábbi pénzügyi naplóban különböző kiadásai szerepelnek mely a kiválasztott autójához tartoznak.` }
            />
            <View style={ { position: "relative", flex: 1 } }>
                <View style={ {
                    position: "absolute",
                    left: -DEFAULT_SEPARATOR,
                    right: -DEFAULT_SEPARATOR,
                    zIndex: 40,
                    gap: 0
                    // height: SIMPLE_HEADER_HEIGHT * 2
                } }>
                    <FilterRow>
                        { orderButtons.map((props, index) => <FilterButton key={ index.toString() } { ...props } />) }
                    </FilterRow>
                    <FilterRow>
                        { filterButtons.map((props, index) => <FilterButton key={ index.toString() } { ...props } />) }
                    </FilterRow>
                </View>
                <TimelineView
                    data={ data }
                    isInitialFetching={ isInitialFetching }
                    fetchNext={ initialFetchHappened && paginator.hasNext() && fetchNext }
                    fetchPrevious={ initialFetchHappened && paginator.hasPrevious() && fetchPrevious }
                    isNextFetching={ isNextFetching }
                    isPreviousFetching={ isPreviousFetching }
                    style={ { paddingBottom: SIMPLE_TABBAR_HEIGHT, paddingTop: 2 * SIMPLE_HEADER_HEIGHT } }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
        // gap: SEPARATOR_SIZES.small
    }
});