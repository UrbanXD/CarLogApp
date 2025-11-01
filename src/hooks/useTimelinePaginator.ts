import { useCallback, useEffect, useRef, useState } from "react";
import { TimelineItemType } from "../components/timelineView/item/TimelineItem.tsx";
import { DatabaseType } from "../database/connector/powersync/AppSchema.ts";
import { useCursor } from "./useCursor.ts";
import { CursorPaginator } from "../database/paginator/CursorPaginator.ts";
import { FilterButtonProps } from "../components/filter/FilterButton.tsx";
import { useFocusEffect } from "expo-router";
import { FlashListRef } from "@shopify/flash-list";
import { PickerItemType } from "../components/Input/picker/PickerItem.tsx";
import {
    AddFilterArgs,
    FILTER_CHANGED_EVENT,
    FilterGroup,
    RemoveFilterArgs,
    ReplaceFilterArgs
} from "../database/paginator/AbstractPaginator.ts";

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
    const flashListRef = useRef<FlashListRef<PickerItemType>>(null);
    const firstFocus = useRef(true);

    const {
        cursorOptions,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField
    } = useCursor<TableItem>(paginator.cursorOptions);

    const [data, setData] = useState<Array<TimelineItemType>>([]);
    const [filters, setFilters] = useState<Map<string, FilterGroup<TableItem, DB>>>(paginator.filterBy);
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

            paginator.refresh().then(result => setData(result.map(mapper)));
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

        paginator.changeCursorOptions(cursorOptions).then(result => {
            setData((_) => {
                setTimeout(() => flashListRef.current?.scrollToTop({ animated: false }), 250);
                return result.map(mapper);
            });
        });
    }, [cursorOptions]);

    useEffect(() => {
        const handler = (newFilters: Map<string, FilterGroup<TableItem, DB>>) => {
            setFilters(newFilters);
        };

        paginator.on(FILTER_CHANGED_EVENT, handler);
        return () => paginator.off(FILTER_CHANGED_EVENT, handler);
    }, [paginator]);

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

    const addFilter = useCallback(async (args: AddFilterArgs<TableItem, DB>) => {
        const result = await paginator.addFilter(args);

        setData((_) => {
            setTimeout(() => flashListRef.current?.scrollToTop({ animated: true }), 250);
            return result.map(mapper);
        });
    }, [paginator]);

    const replaceFilter = useCallback(async (args: ReplaceFilterArgs<TableItem, DB>) => {
        const result = await paginator.replaceFilter(args);

        setData((_) => {
            setTimeout(() => flashListRef.current?.scrollToTop({ animated: true }), 250);
            return result.map(mapper);
        });
    }, [paginator]);

    const removeFilter = useCallback(async (args: RemoveFilterArgs<TableItem, DB>) => {
        const result = await paginator.removeFilter(args);

        if(!result) return;

        setData((_) => {
            setTimeout(() => flashListRef.current?.scrollToTop({ animated: true }), 250);
            return result.map(mapper);
        });
    }, [paginator]);

    const clearFilters = useCallback(async (groupKey?: string) => {
        const result = await paginator.clearFilters(groupKey);
        if(!result) return;

        setData((_) => {
            setTimeout(() => flashListRef.current?.scrollToTop({ animated: true }), 250);
            return result.map(mapper);
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
        ref: flashListRef,
        data,
        initialFetchHappened,
        isInitialFetching,
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