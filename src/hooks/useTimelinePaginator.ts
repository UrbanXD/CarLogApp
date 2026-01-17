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

type UseTimelinePaginatorProps<
    TableItem extends { id: any },
    MappedItem,
    ResultItem = MappedItem
> = {
    paginator: CursorPaginator<TableItem, MappedItem>
    mapper: (item: MappedItem, callback?: () => void) => ResultItem
    mappedItemIdField?: keyof MappedItem | null
    resultItemIdField?: keyof ResultItem | null
    cursorOrderButtons?: Array<{ field: keyof TableItem, table?: keyof DatabaseType | null, title: string }>
}

export function useTimelinePaginator<
    TableItem extends { id: string | number },
    MappedItem = TableItem,
    ResultItem = MappedItem
>({
    paginator,
    mapper,
    mappedItemIdField = "id" as keyof MappedItem,
    resultItemIdField = "id" as keyof ResultItem,
    cursorOrderButtons
}: UseTimelinePaginatorProps<TableItem, MappedItem, ResultItem>) {
    const flashListRef = useRef<FlashListRef<ResultItem>>(null);
    const firstFocus = useRef(true);

    const {
        cursorOptions,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField
    } = useCursor<TableItem>(paginator.cursorOptions, paginator.table);

    const [rawData, setRawData] = useState<Array<MappedItem>>([]);
    const [data, setData] = useState<Array<ResultItem>>([]);
    const [filters, setFilters] = useState<Map<string, FilterGroup<TableItem>>>(paginator.filterBy);
    const [initialFetchHappened, setInitialFetchHappened] = useState(false);
    const [isInitialFetching, setIsInitialFetching] = useState(true);
    const [isNextFetching, setIsNextFetching] = useState(false);
    const [isPreviousFetching, setIsPreviousFetching] = useState(false);

    const scrollToItemId = useRef<string | number | any | null>(null);
    const scrollToItem = useRef<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            if(firstFocus.current) {
                firstFocus.current = false;
                return;
            }

            paginator.initial(scrollToItemId.current).then(result => {
                scrollToItem.current = true;
                setRawData(result);
            });
        }, [])
    );

    useEffect(() => {
        if(rawData.length === 0 && data.length === 0) return;
        if(rawData.length === 0) return setData([]);

        setData((_) => {
            const newItems = rawData.map(rawItem => {
                const id = mappedItemIdField ? rawItem[mappedItemIdField] : null;

                return mapper(rawItem, () => {
                    scrollToItemId.current = id;
                });
            });

            return newItems;
        });
    }, [rawData]);

    useEffect(() => {
        if(rawData.length === 0) return;

        const newData = rawData.map((item) => mapper(item, () => {
            if(!mappedItemIdField) return;

            scrollToItemId.current = item?.[mappedItemIdField] ?? null;
        }));
        setData(newData);
    }, [mapper]);

    useEffect(() => {
        if(firstFocus.current) return;
        if(!scrollToItem.current) return;
        if(!scrollToItemId.current) return;

        scrollToItem.current = false;

        setTimeout(
            () => {
                const itemToScrollTo =
                    resultItemIdField
                    ? data.find(item => (item?.[resultItemIdField]) === scrollToItemId.current) ?? null
                    : null;

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
            setRawData((_) => {
                setInitialFetchHappened(true);
                setIsInitialFetching(false);
                return result;
            });
        });
    }, []);

    useEffect(() => {
        if(!initialFetchHappened) return;

        paginator.changeCursorOptions(cursorOptions).then(result => setRawData(result));
    }, [cursorOptions]);

    useEffect(() => {
        const handler = (newFilters: Map<string, FilterGroup<TableItem>>) => {
            setFilters(newFilters);
        };

        paginator.on(FILTER_CHANGED_EVENT, handler);
        return () => {
            paginator.off(FILTER_CHANGED_EVENT, handler);
        };
    }, [paginator]);

    const refresh = useCallback(async () => {
        const result = await paginator.refresh();
        setRawData(result);
    }, [paginator]);

    const fetchNext = useCallback(async () => {
        if(!paginator.hasNext()) return;

        setIsNextFetching(true);

        const result = await paginator.next();
        if(!result) return setIsNextFetching(false);

        setRawData(prevState => {
            setIsNextFetching(false);
            return [...prevState, ...result];
        });
    }, [paginator]);

    const fetchPrevious = useCallback(async () => {
        if(!paginator.hasPrevious()) return;

        setIsPreviousFetching(true);

        const result = await paginator.previous();
        if(!result) return setIsPreviousFetching(false);

        setRawData(prevState => {
            setIsPreviousFetching(false);
            return [...result, ...prevState];
        });
    }, [paginator]);

    const addFilter = useCallback(async (args: AddFilterArgs<TableItem>) => {
        const result = await paginator.addFilter(args);
        setRawData(result);
    }, [paginator, mapper]);

    const replaceFilter = useCallback(async (args: ReplaceFilterArgs<TableItem>) => {
        const result = await paginator.replaceFilter(args);
        setRawData(result);
    }, [paginator, mapper]);

    const removeFilter = useCallback(async (args: RemoveFilterArgs<TableItem>) => {
        const result = await paginator.removeFilter(args);
        if(result) setRawData(result);
    }, [paginator]);

    const clearFilters = useCallback(async (groupKey?: string) => {
        const result = await paginator.clearFilters(groupKey);
        if(result) setRawData(result);
    }, [paginator]);

    const orderButtons: Array<FilterButtonProps> | undefined = cursorOrderButtons?.map(cursor => ({
        title: cursor.title,
        active: isMainCursor(cursor.field as any, cursor.table as any),
        onPress: () => makeFieldMainCursor(cursor.field as any, cursor.table as any),
        icon: getOrderIconForField(cursor.field as any, cursor.table as any),
        iconOnPress: () => toggleFieldOrder(cursor.field as any, cursor.table as any)
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

export type TimelineFilterManagement<TableItem> = {
    filters: Map<string, FilterGroup<TableItem>>
    addFilter: AddFilter<TableItem>
    replaceFilter: ReplaceFilter<TableItem>
    removeFilter: RemoveFilter<TableItem>
    clearFilters: ClearFilters<TableItem>
}

export type AddFilter<TableItem> = (args: AddFilterArgs<TableItem>) => Promise<void>;
export type ReplaceFilter<TableItem> = (args: ReplaceFilterArgs<TableItem>) => Promise<void>;
export type RemoveFilter<TableItem> = (args: RemoveFilterArgs<TableItem>) => Promise<void>;
export type ClearFilters<TableItem> = (groupKey?: string) => Promise<void>;