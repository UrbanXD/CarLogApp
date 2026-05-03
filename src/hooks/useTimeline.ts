import {
    ExtractColumnsFromQuery,
    ExtractRowFromQuery,
    useInfiniteQuery,
    UseInfiniteQueryOptions
} from "../database/hooks/useInfiniteQuery.ts";
import { FilterButtonProps } from "../components/filter/FilterButton.tsx";
import { useCallback, useMemo } from "react";
import { SelectQueryBuilder } from "kysely";
import { FilterByRange } from "../components/timelineView/TimelineView.tsx";

export type UseTimelineProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MappedItem,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    infiniteQueryOptions: UseInfiniteQueryOptions<QueryBuilder, MappedItem>,
    cursorOrderButtons?: Array<{ field: Columns, title: string }>,
    fromDateRangeFilterField?: Columns
    toDateRangeFilterField?: Columns
}

export function useTimeline<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MappedItem = ExtractRowFromQuery<QueryBuilder>
>({
    infiniteQueryOptions,
    cursorOrderButtons,
    fromDateRangeFilterField,
    toDateRangeFilterField
}: UseTimelineProps<QueryBuilder, MappedItem>) {
    const {
        data,
        isLoading,
        isNextFetching,
        isPrevFetching,
        hasNext,
        hasPrev,
        fetchNext,
        fetchPrev,
        initialStartIndex,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField,
        filters,
        addFilter,
        replaceFilter,
        removeFilter,
        clearFilters
    } = useInfiniteQuery(infiniteQueryOptions);

    const orderButtons: Array<FilterButtonProps> | undefined = useMemo(() => cursorOrderButtons?.map(cursor => ({
        title: cursor.title,
        active: isMainCursor(cursor.field),
        onPress: () => makeFieldMainCursor(cursor.field),
        icon: getOrderIconForField(cursor.field),
        iconOnPress: () => toggleFieldOrder(cursor.field)
    })), [cursorOrderButtons, isMainCursor, makeFieldMainCursor, getOrderIconForField, toggleFieldOrder]);

    const filterByRange: FilterByRange = useCallback((from, to) => {
        if(!fromDateRangeFilterField) return;

        if(from) {
            replaceFilter({
                groupKey: "rangeFromDate",
                filter: { field: fromDateRangeFilterField, operator: ">=", value: from },
                logic: "AND"
            });
        } else {
            removeFilter({
                groupKey: "rangeFromDate",
                filter: { field: fromDateRangeFilterField, operator: ">=", value: from },
                byValue: false
            });
        }

        if(to) {
            replaceFilter({
                groupKey: "rangeToDate",
                filter: { field: toDateRangeFilterField ?? fromDateRangeFilterField, operator: "<=", value: to },
                logic: "AND"
            });
        } else {
            removeFilter({
                groupKey: "rangeToDate",
                filter: { field: toDateRangeFilterField ?? fromDateRangeFilterField, operator: "<=", value: to },
                byValue: false
            });
        }
    }, [replaceFilter, fromDateRangeFilterField, toDateRangeFilterField]);

    return {
        data,
        isLoading,
        isNextFetching,
        isPrevFetching,
        hasNext,
        hasPrev,
        fetchNext,
        fetchPrev,
        initialStartIndex,
        orderButtons,
        filterByRange,
        cursorManager: {
            isMainCursor,
            makeFieldMainCursor,
            toggleFieldOrder,
            getOrderIconForField
        },
        filterManager: {
            filters,
            addFilter,
            replaceFilter,
            removeFilter,
            clearFilters
        }
    };
}