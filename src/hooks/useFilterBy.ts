import { FilterCondition, FilterGroup } from "../database/paginator/AbstractPaginator.ts";
import { useCallback, useState } from "react";
import { DatabaseType } from "../database/connector/powersync/AppSchema.ts";

export type FilterManagement<TableItem, DB = DatabaseType> = {
    filters: Map<string, FilterGroup<TableItem, DB>>
    addFilter: (filter: FilterCondition<TableItem, DB>, groupKey: string, logic?: "AND" | "OR") => void
    replaceFilter: (groupKey: string, filter: FilterCondition<TableItem, DB>, logic?: "AND" | "OR") => void
    removeFilter: (groupKey: string, filter: FilterCondition<TableItem, DB>) => void
    clearFilterGroup: (groupKey: string) => void
}

export function useFilterBy<TableItem, DB = DatabaseType>(
    filterBy?: FilterCondition<TableItem, DB> | Array<FilterGroup<TableItem, DB>>,
    defaultGroupKey?: string
): FilterManagement<TableItem> {
    const [filters, setFilters] = useState<Map<string, FilterGroup<TableItem, DB>>>(
        filterBy ? (Array.isArray(filterBy)
                    ? new Map() //TODO CSINALNi
                    : new Map([[defaultGroupKey ?? "default", { logic: "AND", filters: [filterBy] }]]))
                 : new Map()
    );

    const add = useCallback((
        groupKey: string,
        filters: Map<string, FilterGroup<TableItem, DB>>,
        newFilter: FilterCondition<TableItem, DB>,
        logic: "OR" | "AND"
    ) => {
        if(!filters.has(groupKey)) return filters.set(groupKey, { logic, filters: [newFilter] });

        const existing = filters.get(groupKey);
        const filtersInGroup = existing?.filters ?? [];
        filtersInGroup.push(newFilter);

        return filters.set(groupKey, { logic: existing?.logic ?? logic, filters: filtersInGroup });
    }, []);

    const remove = useCallback((
        groupKey: string,
        filters: Map<string, FilterGroup<TableItem, DB>>,
        filter: FilterCondition<TableItem, DB>,
        byValue?: boolean = true
    ) => {
        const group = filters.get(groupKey);
        if(!group) return filters;

        const filterExpression = (groupFilter: FilterCondition<TableItem, DB>) =>
            groupFilter.field !== filter.field ||
            groupFilter.table !== filter.table ||
            groupFilter.operator !== filter.operator
            || (!byValue ? false : groupFilter.value !== filter.value);

        return filters.set(
            groupKey,
            {
                ...group,
                filters: group.filters.filter(filterExpression)
            }
        );
    }, []);

    const addFilter = useCallback((
        filter: FilterCondition<TableItem, DB>,
        groupKey: string,
        logic?: "OR" | "AND" = "AND"
    ) => {
        setFilters(prev => add(groupKey, new Map(prev), filter, logic));
    }, [add]);

    const replaceFilter = useCallback((
        groupKey: string,
        filter: FilterCondition<TableItem, DB>,
        logic?: "AND" | "OR" = "AND"
    ) => {
        setFilters(prev => {
            let newFilters = remove(groupKey, new Map(prev), filter, false);
            newFilters = add(groupKey, newFilters, filter, logic);

            return newFilters;
        });
    }, [add, remove]);

    const removeFilter = useCallback((groupKey: string, filter: FilterCondition<TableItem, DB>) => {
        setFilters(prev => {
            return remove(groupKey, new Map(prev), filter, true);
            // const newFilters = new Map(prev);
            //
            // return newFilters.set(
            //     groupKey,
            //     {
            //         ...group,
            //         filters: group.filters.filter(groupFilter => groupFilter.field !== filter.field || groupFilter.table !== filter.table || groupFilter.operator !== filter.operator || groupFilter.value !== filter.value)
            //     }
            // );
        });
    }, []);

    const clearFilterGroup = useCallback((groupKey: string) => {
        setFilters(prev => {
            const group = prev.get(groupKey);
            if(!group) return prev;

            const newFilters = new Map(prev);

            newFilters.set(
                groupKey,
                { ...group, filters: [] }
            );

            return newFilters;
        });
    }, []);

    return {
        filters,
        addFilter,
        replaceFilter,
        removeFilter,
        clearFilterGroup
    };
}