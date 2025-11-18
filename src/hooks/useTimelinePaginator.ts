import { useCallback, useEffect, useRef, useState } from "react";
import { DatabaseType } from "../database/connector/powersync/AppSchema.ts";
import { useCursor } from "./useCursor.ts";
import { CursorPaginator } from "../database/paginator/CursorPaginator.ts";
import { FilterButtonProps } from "../components/filter/FilterButton.tsx";
import { useFocusEffect } from "expo-router";
import { FlashListRef } from "@shopify/flash-list";
import {
    AddFilterArgs,
    FILTER_CHANGED_EVENT,
    FilterGroup,
    RemoveFilterArgs,
    ReplaceFilterArgs
} from "../database/paginator/AbstractPaginator.ts";

type UseTimelinePaginatorProps<TableItem, MappedItem, ResultItem = MappedItem, DB> = {
    paginator: CursorPaginator<TableItem, MappedItem, DB>
    mapper: (item: MappedItem, callback?: () => void) => ResultItem
    cursorOrderButtons?: Array<{ field: keyof TableItem, table?: keyof DB | null, title: string }>
}

export function useTimelinePaginator<TableItem, MappedItem = TableItem, ResultItem = MappedItem, DB = DatabaseType>({
    paginator,
    mapper,
    cursorOrderButtons
}: UseTimelinePaginatorProps<TableItem, MappedItem, ResultItem, DB>) {
    const flashListRef = useRef<FlashListRef<ResultItem>>(null);
    const firstFocus = useRef(true);

    const {
        cursorOptions,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField
    } = useCursor<TableItem>(paginator.cursorOptions, paginator.table);

    const [data, setData] = useState<Array<ResultItem>>([]);
    const [filters, setFilters] = useState<Map<string, FilterGroup<TableItem, DB>>>(paginator.filterBy);
    const [initialFetchHappened, setInitialFetchHappened] = useState(false);
    const [isInitialFetching, setIsInitialFetching] = useState(true);
    const [isNextFetching, setIsNextFetching] = useState(false);
    const [isPreviousFetching, setIsPreviousFetching] = useState(false);

    const scrollToItemId = useRef<number | string | null>(null);
    const scrollToItem = useRef<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            if(firstFocus.current) {
                firstFocus.current = false;
                return;
            }

            console.log(scrollToItemId.current);
            paginator.initial(scrollToItemId.current).then(result => {
                //TODO PLACE ES PESSANGERBE ez itt most value lenne
                const newData = result.map((item) => mapper(item, () => scrollToItemId.current = item.id));
                scrollToItem.current = true;

                setData(newData);
            });
        }, [])
    );

    useEffect(() => {
        if(firstFocus.current) return;
        if(!scrollToItem.current) return;
        if(!scrollToItemId.current) return;

        scrollToItem.current = false;

        setTimeout(
            () => {
                const itemToScrollTo = data.find(item => item.id === scrollToItemId.current);

                if(itemToScrollTo) {
                    scrollToItemId.current = null;

                    flashListRef.current?.scrollToItem({
                        item: itemToScrollTo,
                        animated: true,
                        viewPosition: 0.25
                    });
                } else {
                    flashListRef.current?.scrollToTop({ animated: false });
                }
            },
            75
        );
    }, [data]);

    useEffect(() => {
        setInitialFetchHappened(false);

        paginator.initial().then(result => {
            setData((_) => {
                setInitialFetchHappened(true);
                setIsInitialFetching(false);
                return result.map((item) => mapper(item, () => scrollToItemId.current = item.id));
            });
        });
    }, []);

    useEffect(() => {
        if(!initialFetchHappened) return;

        paginator.changeCursorOptions(cursorOptions).then(result => {
            const newData = result.map((item) => mapper(item, () => scrollToItemId.current = item.id));
            setData(newData);
        });
    }, [cursorOptions]);

    useEffect(() => {
        const handler = (newFilters: Map<string, FilterGroup<TableItem, DB>>) => {
            setFilters(newFilters);
        };

        paginator.on(FILTER_CHANGED_EVENT, handler);
        return () => paginator.off(FILTER_CHANGED_EVENT, handler);
    }, [paginator]);

    const refresh = useCallback(async () => {
        const result = await paginator.refresh();

        return result.map((item) => mapper(item, () => scrollToItemId.current = item.id));
    }, [paginator, mapper]);

    const fetchNext = useCallback(async () => {
        if(!paginator.hasNext()) return;

        setIsNextFetching(true);
        const result = await paginator.next();
        if(!result) return setIsNextFetching(false);

        const newData = result.map((item) => mapper(item, () => scrollToItemId.current = item.id));

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

        const newData = result.map((item) => mapper(item, () => scrollToItemId.current = item.id));

        setData(prevState => {
            setIsPreviousFetching(false);
            return [...newData, ...prevState];
        });
    }, [paginator]);

    const addFilter = useCallback(async (args: AddFilterArgs<TableItem, DB>) => {
        const result = await paginator.addFilter(args);

        const newData = result.map((item) => mapper(item, () => scrollToItemId.current = item.id));
        setData(newData);
    }, [paginator]);

    const replaceFilter = useCallback(async (args: ReplaceFilterArgs<TableItem, DB>) => {
        const result = await paginator.replaceFilter(args);

        const newData = result.map((item) => mapper(item, () => scrollToItemId.current = item.id));
        setData(newData);
    }, [paginator]);

    const removeFilter = useCallback(async (args: RemoveFilterArgs<TableItem, DB>) => {
        const result = await paginator.removeFilter(args);

        if(!result) return;

        const newData = result.map((item) => mapper(item, () => scrollToItemId.current = item.id));
        setData(newData);
    }, [paginator]);

    const clearFilters = useCallback(async (groupKey?: string) => {
        const result = await paginator.clearFilters(groupKey);
        if(!result) return;

        const newData = result.map((item) => mapper(item, () => scrollToItemId.current = item.id));
        setData(newData);
    }, [paginator]);

    const orderButtons: Array<FilterButtonProps> | undefined = cursorOrderButtons?.map(cursor => ({
        title: cursor.title,
        active: isMainCursor(cursor.field, cursor.table),
        onPress: () => makeFieldMainCursor(cursor.field, cursor.table),
        icon: getOrderIconForField(cursor.field, cursor.table),
        iconOnPress: () => toggleFieldOrder(cursor.field, cursor.table)
    }));

    return {
        ref: flashListRef,
        data,
        initialFetchHappened,
        isInitialFetching,
        refresh,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching,
        timelineFilterManagement: {
            filters,
            addFilter,
            replaceFilter,
            removeFilter,
            clearFilters
        },
        orderButtons
    };
}

export type TimelineFilterManagement<TableItem, DB = DatabaseType> = {
    filters: Map<string, FilterGroup<TableItem, DB>>
    addFilter: AddFilter<TableItem, DB>
    replaceFilter: ReplaceFilter<TableItem, DB>
    removeFilter: RemoveFilter<TableItem, DB>
    clearFilters: ClearFilters<TableItem, DB>
}

export type AddFilter<TableItem, DB = DatabaseType> = (args: AddFilterArgs<TableItem, DB>) => void;
export type ReplaceFilter<TableItem, DB = DatabaseType> = (args: ReplaceFilterArgs<TableItem, DB>) => void;
export type RemoveFilter<TableItem, DB = DatabaseType> = (args: RemoveFilterArgs<TableItem, DB>) => void;
export type ClearFilters<TableItem, DB = DatabaseType> = (groupKey?: string) => void;