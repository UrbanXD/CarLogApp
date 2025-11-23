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
    mappedItemIdField?: string
    resultItemIdField?: string
    cursorOrderButtons?: Array<{ field: keyof TableItem, table?: keyof DB | null, title: string }>
}

export function useTimelinePaginator<TableItem, MappedItem = TableItem, ResultItem = MappedItem, DB = DatabaseType>({
    paginator,
    mapper,
    mappedItemIdField = "id",
    resultItemIdField = "id",
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

    const [rawData, setRawData] = useState<Array<MappedItem>>([]);
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

            paginator.initial(scrollToItemId.current).then(result => {
                scrollToItem.current = true;

                setRawData(result);
            });
        }, [])
    );

    useEffect(() => {
        if(rawData.length === 0 && data.length === 0) return;
        if(rawData.length === 0) return setData([]);

        setData(prev => {
            const prevById = new Map(
                prev.map(item => [item[resultItemIdField], item])
            );

            const newItems = rawData.map(rawItem => {
                const id = rawItem[mappedItemIdField];

                if(prevById.has(id)) return prevById.get(id)!;

                return mapper(rawItem, () => {
                    scrollToItemId.current = id;
                });
            });

            return newItems;
        });
    }, [rawData]);

    useEffect(() => {
        if(rawData.length === 0) return;

        const newData = rawData.map((item) => mapper(item, () => scrollToItemId.current = item?.[mappedItemIdField]));
        setData(newData);
    }, [mapper]);

    useEffect(() => {
        if(firstFocus.current) return;
        if(!scrollToItem.current) return;
        if(!scrollToItemId.current) return;

        scrollToItem.current = false;

        setTimeout(
            () => {
                const itemToScrollTo = data.find(item => item?.[resultItemIdField] === scrollToItemId.current);

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
        const handler = (newFilters: Map<string, FilterGroup<TableItem, DB>>) => {
            setFilters(newFilters);
        };

        paginator.on(FILTER_CHANGED_EVENT, handler);
        return () => paginator.off(FILTER_CHANGED_EVENT, handler);
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

    const addFilter = useCallback(async (args: AddFilterArgs<TableItem, DB>) => {
        const result = await paginator.addFilter(args);
        setRawData(result);
    }, [paginator, mapper]);

    const replaceFilter = useCallback(async (args: ReplaceFilterArgs<TableItem, DB>) => {
        const result = await paginator.replaceFilter(args);
        setRawData(result);
    }, [paginator, mapper]);

    const removeFilter = useCallback(async (args: RemoveFilterArgs<TableItem, DB>) => {
        const result = await paginator.removeFilter(args);
        setRawData(result);
    }, [paginator]);

    const clearFilters = useCallback(async (groupKey?: string) => {
        const result = await paginator.clearFilters(groupKey);
        setRawData(result);
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