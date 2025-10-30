import { FilterCondition, FilterGroup } from "../database/paginator/AbstractPaginator.ts";
import { useCallback, useState } from "react";
import { DatabaseType } from "../database/connector/powersync/AppSchema.ts";

export type FilterManagement<TableItem, DB = DatabaseType> = {
    filters: Map<string, FilterGroup<TableItem, DB>>,
    addFilter: (filter: FilterCondition<TableItem, DB>, groupKey: string, logic?: "AND" | "OR") => void
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

    const addFilter = useCallback((
        filter: FilterCondition<TableItem, DB>,
        groupKey: string,
        logic?: "OR" | "AND" = "AND"
    ) => {
        setFilters(prev => {
            const newFilters = new Map(prev);

            if(!newFilters.has(groupKey)) {
                newFilters.set(groupKey, { logic, filters: [filter] });
            } else {
                const existing = newFilters.get(groupKey);
                const filtersInGroup = existing?.filters ?? [];
                filtersInGroup.push(filter);
                newFilters.set(groupKey, { logic: existing?.logic ?? logic, filters: filtersInGroup });
            }

            return newFilters;
        });
    });

    const removeFilter = useCallback((groupKey: string, filter: FilterCondition<TableItem, DB>) => {
        setFilters(prev => {
            const group = prev.get(groupKey);
            if(!group) return prev;

            const newFilters = new Map(prev);

            return newFilters.set(
                groupKey,
                {
                    ...group,
                    filters: group.filters.filter(groupFilter => groupFilter.field !== filter.field || groupFilter.table !== filter.table || groupFilter.operator !== filter.operator || groupFilter.value !== filter.value)
                }
            );
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
        removeFilter,
        clearFilterGroup
    };
}