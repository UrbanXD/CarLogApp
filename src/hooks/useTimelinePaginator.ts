import { useCallback, useEffect, useState } from "react";
import { TimelineItemType } from "../components/timelineView/item/TimelineItem.tsx";
import { Paginator } from "../database/paginator/AbstractPaginator.ts";
import { DatabaseType } from "../database/connector/powersync/AppSchema.ts";

type UseTimelinePaginatorProps<TableItem, MappedItem, DB> = {
    paginator: Paginator<TableItem, MappedItem, DB>
    mapper: (item: MappedItem) => TimelineItemType
}

export function useTimelinePaginator<TableItem, MappedItem = TableItem, DB = DatabaseType>({
    paginator,
    mapper
}: UseTimelinePaginatorProps<TableItem, MappedItem, DB>) {

    console.log(paginator, "pagis");

    const [data, setData] = useState<Array<TimelineItemType>>([]);
    const [isInitialFetching, setIsInitialFetching] = useState(true);
    const [isNextFetching, setIsNextFetching] = useState(false);
    const [isPreviousFetching, setIsPreviousFetching] = useState(false);

    useEffect(() => {
        paginator.initial().then(result => {
            setData((_) => {
                setIsInitialFetching(false);
                return result.map(mapper);
            });
        });
    }, []);

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

    return { data, isInitialFetching, fetchNext, isNextFetching, fetchPrevious, isPreviousFetching };
}