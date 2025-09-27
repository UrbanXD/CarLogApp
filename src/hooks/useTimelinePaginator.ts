import { useCallback, useEffect, useState } from "react";
import { TimelineItemType } from "../components/timelineView/item/TimelineItem.tsx";
import { FilterCondition, Paginator } from "../database/paginator/AbstractPaginator.ts";
import { DatabaseType, ExpenseTableRow } from "../database/connector/powersync/AppSchema.ts";
import { useFilterBy } from "./useFilterBy.ts";

type UseTimelinePaginatorProps<TableItem, MappedItem, DB> = {
    paginator: Paginator<TableItem, MappedItem, DB>
    mapper: (item: MappedItem) => TimelineItemType
    defaultFilters?: FilterCondition<TableItem> | Array<FilterCondition<TableItem>>
}

export function useTimelinePaginator<TableItem, MappedItem = TableItem, DB = DatabaseType>({
    paginator,
    mapper,
    defaultFilters
}: UseTimelinePaginatorProps<TableItem, MappedItem, DB>) {
    const { filters, setFilter, removeFilter } = useFilterBy<ExpenseTableRow>(defaultFilters);

    const [data, setData] = useState<Array<TimelineItemType>>([]);
    const [initialFetchHappened, setInitialFetchHappened] = useState(false);
    const [isInitialFetching, setIsInitialFetching] = useState(true);
    const [isNextFetching, setIsNextFetching] = useState(false);
    const [isPreviousFetching, setIsPreviousFetching] = useState(false);

    useEffect(() => {
        setInitialFetchHappened(false);
        paginator.initial().then(result => {
            setData((_) => {
                setInitialFetchHappened(true);
                setIsInitialFetching(false);
                return result.map(mapper);
            });
        });
    }, []);

    useEffect(() => {
        paginator.filter(filters).then(result => {
            setData((_) => {
                return result.map(mapper);
            });
        });
    }, [filters]);

    const fetchNext = useCallback(async () => {
        if(!paginator.hasNext()) return;

        setIsNextFetching(true);
        const result = await paginator.next();
        if(!result) return setIsNextFetching(false);

        const newData = result.map(mapper);

        setData(prevState => {
            setIsNextFetching(false);
            return [...prevState, ...newData];
        });
    }, [paginator]);

    const fetchPrevious = useCallback(async () => {
        if(!paginator.hasPrevious()) return;

        setIsPreviousFetching(true);
        const result = await paginator.previous();

        if(!result) return setIsPreviousFetching(false);

        const newData = result.map(mapper);
        setData(prevState => {
            setIsPreviousFetching(false);
            return [...newData, ...prevState];
        });
    }, [paginator]);

    return {
        data,
        initialFetchHappened,
        isInitialFetching,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching,
        setFilter,
        removeFilter
    };
}