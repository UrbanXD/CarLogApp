import {
    ExtractColumnsFromQuery,
    ExtractRowFromQuery,
    useInfiniteQuery,
    UseInfiniteQueryOptions
} from "../database/hooks/useInfiniteQuery.ts";
import { FilterButtonProps } from "../components/filter/FilterButton.tsx";
import { useMemo } from "react";
import { SelectQueryBuilder } from "kysely";

export type UseTimelineProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MappedItem,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    infiniteQueryOptions: UseInfiniteQueryOptions<QueryBuilder, MappedItem>,
    cursorOrderButtons?: Array<{ field: Columns, title: string }>
}

export function useTimeline<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MappedItem = ExtractRowFromQuery<QueryBuilder>
>({ infiniteQueryOptions, cursorOrderButtons }: UseTimelineProps<QueryBuilder, MappedItem>) {
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