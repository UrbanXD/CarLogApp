import { FilterCondition } from "../database/paginator/AbstractPaginator.ts";
import { useCallback, useState } from "react";

export function useFilterBy<TableItem>(filterBy?: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>) {
    const [filters, setFilters] = useState<Array<FilterCondition<TableItem>>>(
        filterBy ? (Array.isArray(filterBy) ? filterBy : [filterBy]) : []
    );

    const setFilter = useCallback(
        (
            field: keyof TableItem,
            operator: FilterCondition<TableItem>["operator"] = "=",
            value: FilterCondition<TableItem>["value"]
        ) => {
            setFilters(prev =>
                prev.some(filter => filter.field === field)
                ? prev.map(filter => (filter.field === field ? { ...filter, value, operator } : filter)) // already in filters
                : [...prev, { field, operator, value }] // new filter
            );
        },
        []
    );

    const removeFilter = useCallback((field: keyof TableItem) => {
        setFilters(prev => prev.filter(f => f.field !== field));
    }, []);

    const setAllFilter = useCallback((newFilters: Array<FilterCondition<TableItem>>) => {
        setFilters(newFilters);
    }, []);

    return {
        filters,
        setFilter,
        removeFilter,
        setAllFilter
    };
}