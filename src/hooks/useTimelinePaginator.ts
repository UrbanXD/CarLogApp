import { useCallback, useEffect, useRef, useState } from "react";
import { TimelineItemType } from "../components/timelineView/item/TimelineItem.tsx";
import { DatabaseType } from "../database/connector/powersync/AppSchema.ts";
import { useFilterBy } from "./useFilterBy.ts";
import { useCursor } from "./useCursor.ts";
import { CursorPaginator } from "../database/paginator/CursorPaginator.ts";
import { FilterButtonProps } from "../components/filter/FilterButton.tsx";
import { useFocusEffect } from "expo-router";

type UseTimelinePaginatorProps<TableItem, MappedItem, DB> = {
    paginator: CursorPaginator<TableItem, MappedItem, DB>
    mapper: (item: MappedItem) => TimelineItemType
    cursorOrderButtons?: Array<{ field: keyof TableItem, table?: keyof DB | null, title: string }>
}

export function useTimelinePaginator<TableItem, MappedItem = TableItem, DB = DatabaseType>({
    paginator,
    mapper,
    cursorOrderButtons
}: UseTimelinePaginatorProps<TableItem, MappedItem, DB>) {
    const filterManagement = useFilterBy<TableItem>();
    const { filters } = filterManagement;

    const {
        cursorOptions,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField
    } = useCursor<TableItem>(paginator.cursorOptions);

    const firstFocus = useRef(true);

    const [data, setData] = useState<Array<TimelineItemType>>([]);
    const [initialFetchHappened, setInitialFetchHappened] = useState(false);
    const [isInitialFetching, setIsInitialFetching] = useState(true);
    const [isNextFetching, setIsNextFetching] = useState(false);
    const [isPreviousFetching, setIsPreviousFetching] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if(firstFocus.current) {
                firstFocus.current = false;
                return;
            }

            paginator.refresh().then(result => {
                setData(result.map(mapper));
            });
        }, [])
    );

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
        if(!initialFetchHappened) return;

        paginator.filter(Array.from(filters.values())).then(result => {
            setData((_) => {
                return result.map(mapper);
            });
        });
    }, [filters]);

    useEffect(() => {
        if(!initialFetchHappened) return;

        paginator.changeCursorOptions(cursorOptions).then(result => {
            setData((_) => {
                return result.map(mapper);
            });
        });
    }, [cursorOptions]);

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

    const orderButtons: Array<FilterButtonProps> | undefined = cursorOrderButtons?.map(cursor => ({
        title: cursor.title,
        active: isMainCursor(cursor.field, cursor.table),
        onPress: () => makeFieldMainCursor(cursor.field, cursor.table),
        icon: getOrderIconForField(cursor.field, cursor.table),
        iconOnPress: () => toggleFieldOrder(cursor.field, cursor.table)
    }));

    return {
        data,
        initialFetchHappened,
        isInitialFetching,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching,
        filterManagement,
        orderButtons
    };
}