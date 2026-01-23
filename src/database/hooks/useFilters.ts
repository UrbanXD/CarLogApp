import { useCallback, useState } from "react";
import { ExtractColumnsFromQuery, FilterCondition, FilterGroup } from "./useInfiniteQuery.ts";
import { SelectQueryBuilder } from "kysely";

export type AddFilterArgs<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    groupKey: string,
    filter: FilterCondition<QueryBuilder, Columns> | Array<FilterCondition<QueryBuilder, Columns>>,
    logic?: "OR" | "AND"
}

export type ReplaceFilterArgs<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    groupKey: string,
    filter: FilterCondition<QueryBuilder, Columns>,
    logic?: "OR" | "AND"
}

export type RemoveFilterArgs<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    groupKey: string,
    filter: FilterCondition<QueryBuilder, Columns>,
    byValue?: boolean
}

export type FilterManager<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = ReturnType<typeof useFilters<QueryBuilder, Columns>>;

export function useFilters<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>(defaultFilters: Array<FilterGroup<QueryBuilder, Columns> & { key: string }>) {
    const [filters, setFilters] = useState<Map<string, FilterGroup<QueryBuilder, Columns>>>(() => {
        return new Map(defaultFilters.map(({ key, ...filter }) => [key, filter]));
    });

    const addFilter = useCallback(({
        groupKey,
        filter,
        logic = "AND"
    }: AddFilterArgs<QueryBuilder, Columns>) => {
        setFilters((prevFilters) => {
            const nextFilters = new Map(prevFilters);
            const group = nextFilters.get(groupKey);

            const newFilterArray = Array.isArray(filter) ? filter : [filter];

            if(!group) {
                nextFilters.set(groupKey, {
                    logic,
                    filters: newFilterArray
                });
            } else {
                nextFilters.set(groupKey, {
                    ...group,
                    filters: [...group.filters, ...newFilterArray]
                });
            }

            return nextFilters;
        });
    }, []);

    const replaceFilter = useCallback(({
        groupKey,
        filter,
        logic = "AND"
    }: ReplaceFilterArgs<QueryBuilder, Columns>) => {
        setFilters((prevFilters) => {
            const nextFilters = new Map(prevFilters);
            const group = nextFilters.get(groupKey);

            if(!group) {
                nextFilters.set(groupKey, {
                    logic,
                    filters: [filter]
                });
            } else {
                const filteredGroup = group.filters.filter((groupFilter) =>
                    groupFilter.field !== filter.field ||
                    groupFilter.operator !== filter.operator
                );

                nextFilters.set(groupKey, {
                    ...group,
                    logic: group.logic ?? logic,
                    filters: [...filteredGroup, filter]
                });
            }

            return nextFilters;
        });
    }, []);

    const removeFilter = useCallback(({
        groupKey,
        filter,
        byValue = true
    }: RemoveFilterArgs<QueryBuilder, Columns>) => {
        setFilters((prevFilters) => {
            const group = prevFilters.get(groupKey);
            if(!group) return prevFilters; // Ha nincs ilyen csoport, nem változik semmi

            const nextFilters = new Map(prevFilters);

            const remainingFilters = group.filters.filter((groupFilter) =>
                groupFilter.field !== filter.field ||
                groupFilter.operator !== filter.operator ||
                (byValue && groupFilter.value !== filter.value)
            );

            if(remainingFilters.length === 0) {
                nextFilters.delete(groupKey);
            } else {
                nextFilters.set(groupKey, {
                    ...group,
                    filters: remainingFilters
                });
            }

            return nextFilters;
        });
    }, []);

    const clearFilters = useCallback((groupKey?: string) => {
        setFilters((prevFilters) => {
            if(!groupKey) return new Map();

            if(!prevFilters.has(groupKey)) return prevFilters;

            const nextFilters = new Map(prevFilters);
            nextFilters.delete(groupKey);
            return nextFilters;
        });
    }, []);

    return { filters, addFilter, replaceFilter, removeFilter, clearFilters };
}