import { useCallback, useEffect, useMemo, useState } from "react";
import { sql } from "@powersync/kysely-driver";
import {
    ComparisonOperatorExpression,
    Expression,
    OrderByDirectionExpression,
    RawBuilder,
    SelectQueryBuilder,
    SqlBool
} from "kysely";
import { QueryParam } from "@powersync/react-native";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { getCursorValues } from "../utils/getCursorValues.ts";
import { addCursor } from "../utils/addCursor.ts";
import { useCursor } from "./useCursor.ts";
import { useFilters } from "./useFilters.ts";
import { addOrder } from "../utils/addOrder.ts";

export type CursorDirection = "initial" | "next" | "prev";

export type CursorValue<TableItem> = TableItem[keyof TableItem];

export type Cursor<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    field: Columns,
    order?: OrderByDirectionExpression,
    toLowerCase?: boolean
}

export type CursorOptions<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    cursor: Cursor<QueryBuilder, Columns> | Array<Cursor<QueryBuilder, Columns>>,
    defaultOrder?: OrderByDirectionExpression
}

export type FilterCondition<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    field: Columns
    operator: ComparisonOperatorExpression
    value: any
    customSql?: (fieldRef: Columns | RawBuilder<Columns>) => RawBuilder<any>
}

export type FilterGroup<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    logic: "AND" | "OR"
    filters: Array<FilterCondition<QueryBuilder, Columns>>
}

export type ExtractRowFromQuery<QueryBuilder> = QueryBuilder extends SelectQueryBuilder<any, any, infer Row>
                                                ? Row
                                                : never;
export type ExtractTablesFromQuery<QueryBuilder> = QueryBuilder extends SelectQueryBuilder<any, infer Tables, any>
                                                   ? Tables
                                                   : never;
export type ExtractColumnsFromQuery<QueryBuilder> = QueryBuilder extends SelectQueryBuilder<infer Schema, infer Tables, any>
                                                    ? {
                                                        [Table in Tables & keyof Schema]: Table extends string
                                                                                          ? {
                                                                                              [Column in keyof Schema[Table]]: Column extends string
                                                                                                                               ? `${ Table }.${ Column }`
                                                                                                                               : never;
                                                                                          }[keyof Schema[Table]]
                                                                                          : never;
                                                    }[Tables & keyof Schema]
                                                    : never;

export type UseInfiniteQueryOptions<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MappedItem,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    baseQuery: QueryBuilder,
    defaultCursorOptions: CursorOptions<QueryBuilder, Columns>
    defaultFilters?: Array<FilterGroup<QueryBuilder, Columns> & { key: string }>,
    defaultItem?: {
        idField: keyof TableItem
        idValue: any,
    },
    perPage?: number
    mapper?: (item: TableItem, index: number) => MappedItem | Promise<MappedItem>
    mappedItemId?: keyof MappedItem
}

export const useInfiniteQuery = <
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MappedItem = ExtractRowFromQuery<QueryBuilder>,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>({
    defaultCursorOptions,
    baseQuery,
    defaultFilters,
    defaultItem,
    perPage = 15,
    mapper,
    mappedItemId = "id"
}: UseInfiniteQueryOptions<QueryBuilder, MappedItem, TableItem, Columns>) => {
    const { db, powersync } = useDatabase();

    const stringifiedCursors = JSON.stringify(defaultCursorOptions);
    const stringifiedMapper = JSON.stringify(mapper);
    const stableDefaultCursorOptions = useMemo(() => defaultCursorOptions, [stringifiedCursors]);
    const stableMapper = useMemo(() => mapper, [stringifiedMapper]);

    const {
        cursorOptions,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField
    } = useCursor<QueryBuilder, Columns>(stableDefaultCursorOptions);

    const {
        filters,
        addFilter,
        replaceFilter,
        removeFilter,
        clearFilters
    } = useFilters(defaultFilters);

    const [data, setData] = useState<Array<MappedItem>>([]);
    const [initialStartIndex, setInitialStartIndex] = useState<number>(0);

    const [isLoading, setIsLoading] = useState(true);
    const [isNextFetching, setIsNextFetching] = useState(false);
    const [isPrevFetching, setIsPrevFetching] = useState(false);
    const [isDefaultCursorFetching, setIsDefaultCursorFetching] = useState(false);

    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    const [nextCursorValues, setNextCursorValues] = useState<CursorValue<TableItem> | Array<CursorValue<TableItem>> | null>(
        null);
    const [prevCursorValues, setPrevCursorValues] = useState<CursorValue<TableItem> | Array<CursorValue<TableItem>> | null>(
        null);

    const getBaseBuilder = useCallback(() => {
        let query = baseQuery;

        filters.forEach((group) => {
            if(group.filters.length === 0) return;

            query = query.where((eb) => {
                const expressions: Expression<SqlBool>[] = [];

                group.filters.forEach((filter) => {
                    const operand = filter.customSql ? filter.customSql(filter.field) : filter.field as string;

                    expressions.push(eb.eb(operand, filter.operator, filter.value));
                });

                if(group.logic.toUpperCase() === "OR") return eb.or(expressions);

                return eb.and(expressions);
            }) as QueryBuilder;
        });

        const cursors: Array<Cursor<QueryBuilder, Columns>> = Array.isArray(cursorOptions.cursor)
                                                              ? cursorOptions.cursor
                                                              : [cursorOptions.cursor];

        cursors.forEach((cursor) => {
            query = query.select(sql.ref(cursor.field)) as QueryBuilder;
        });

        return query;
    }, [db, cursorOptions, filters]);

    const setNextCursor = useCallback((lastItem: TableItem) => {
        setNextCursorValues(getCursorValues(lastItem, cursorOptions));
    }, [cursorOptions]);

    const setPrevCursor = useCallback((firstItem: TableItem) => {
        setPrevCursorValues(getCursorValues(firstItem, cursorOptions));
    }, [cursorOptions]);

    const getUniqueNewItems = useCallback((oldItems: Array<MappedItem>, newItems: Array<MappedItem>) => (
        newItems.filter(newItem => {
            const newId = newItem?.[mappedItemId];

            if(newId === undefined || newId === null) {
                console.warn(`Missing ID in new item using key: ${ String(mappedItemId) }`, newItem);
                return false;
            }

            return !oldItems.some(oldItem => oldItem?.[mappedItemId] === newId);
        })
    ), [mappedItemId]);

    const fetchNext = useCallback(
        async () => {
            if(isNextFetching || (data.length > 0 && !hasNext) || isLoading) return;
            setIsNextFetching(true);

            try {
                let nextBuilder = getBaseBuilder().limit(perPage + 1);
                nextBuilder = addCursor(nextBuilder, cursorOptions, nextCursorValues, "next");

                const compiled = nextBuilder.compile();
                const results = await powersync.getAll<TableItem>(compiled.sql, compiled.parameters as any[]);

                const hasMore = results.length > perPage;
                if(hasMore) results.pop();

                if(results.length > 0) {
                    const mapped = stableMapper
                                   ? await Promise.all(results.map(stableMapper))
                                   : results as unknown as Array<MappedItem>;

                    setData(prev => {
                        const uniqueNewItems = getUniqueNewItems(prev, mapped);

                        if(uniqueNewItems.length === 0) return prev;
                        return [...prev, ...uniqueNewItems];
                    });
                }

                setHasNext(hasMore);

                const nextCursor = results[results.length - 1];
                if(nextCursor) setNextCursor(nextCursor);
                if(!prevCursorValues && results.length > 0) setPrevCursor(results[0]);
            } catch(error) {
                console.log("Fetch next infinite query error: ", error);
            } finally {
                setIsNextFetching(false);
            }
        },
        [
            isLoading,
            isNextFetching,
            hasNext,
            data.length,
            nextCursorValues,
            getBaseBuilder,
            cursorOptions,
            perPage,
            stableMapper,
            prevCursorValues,
            powersync,
            setPrevCursor,
            setNextCursor,
            getUniqueNewItems
        ]
    );

    const fetchPrev = useCallback(async () => {
        if(isPrevFetching || !hasPrev || isLoading) return;
        setIsPrevFetching(true);

        try {
            let prevBuilder = getBaseBuilder().limit(perPage + 1);
            prevBuilder = addCursor(prevBuilder, cursorOptions, prevCursorValues, "prev");

            const compiled = prevBuilder.compile();
            const rawResults = (await powersync.getAll<TableItem>(compiled.sql, compiled.parameters as any[]));
            const results = [...rawResults].reverse();

            const hasMore = results.length > perPage;
            if(hasMore) results.unshift();

            if(results.length > 0) {
                const mapped = stableMapper
                               ? await Promise.all(results.map(stableMapper))
                               : results as unknown as Array<MappedItem>;

                setData(prev => {
                    const uniqueNewItems = getUniqueNewItems(prev, mapped);

                    if(uniqueNewItems.length === 0) return prev;
                    return [...uniqueNewItems, ...prev];
                });
            }

            setHasPrev(hasMore);

            const prevCursor = results[results.length - 1];
            if(prevCursor) setPrevCursor(prevCursor);
            if(!nextCursorValues && results.length > 0) setNextCursor(results[results.length - 1]);
        } finally {
            setIsPrevFetching(false);
        }
    }, [
        isLoading,
        isPrevFetching,
        hasPrev,
        prevCursorValues,
        nextCursorValues,
        getBaseBuilder,
        cursorOptions,
        perPage,
        stableMapper,
        powersync,
        setPrevCursor,
        setNextCursor,
        getUniqueNewItems
    ]);

    useEffect(() => {
        const setupInitialCursors = async () => {
            if(isDefaultCursorFetching) return;

            setIsLoading(true);
            setData([]);
            setNextCursorValues(null);
            setPrevCursorValues(null);

            if(defaultItem) {
                setIsDefaultCursorFetching(true);

                const result = await getBaseBuilder()
                .where(defaultItem.idField, "=", defaultItem.idField)
                .executeTakeFirst();

                const defaultItem = (result as TableItem) ?? null;

                if(defaultItem) {
                    const defaultCursorValues = getCursorValues(defaultItem, cursorOptions);

                    const [nextRes, prevRes] = await Promise.all([
                        addCursor(
                            getBaseBuilder().limit(perPage),
                            cursorOptions,
                            defaultCursorValues,
                            "next"
                        )
                        .execute(),
                        addCursor(
                            getBaseBuilder().limit(perPage),
                            cursorOptions,
                            defaultCursorValues,
                            "prev"
                        )
                        .execute()
                    ]);

                    const farNextItem = nextRes.length > 0 ? nextRes[nextRes.length - 1] : defaultItem;
                    const farPrevItem = prevRes.length > 0 ? prevRes[prevRes.length - 1] : null;

                    setNextCursorValues(getCursorValues<QueryBuilder, TableItem, Columns>(
                        farNextItem ?? defaultItem,
                        cursorOptions
                    ));
                    setPrevCursorValues(farPrevItem ? getCursorValues<QueryBuilder, TableItem, Columns>(
                        farPrevItem,
                        cursorOptions
                    ) : null);
                    setHasNext(nextRes.length === perPage);
                    setHasPrev(prevRes.length === perPage);
                }

                setIsDefaultCursorFetching(false);
            } else {
                setNextCursorValues(null);
                setPrevCursorValues(null);
                setHasNext(false);
                setHasPrev(false);
            }
        };

        setupInitialCursors();
    }, [defaultItem, getBaseBuilder]);

    useEffect(
        () => {
            if(isDefaultCursorFetching) return;

            let watchBuilder = getBaseBuilder();

            watchBuilder = addCursor<QueryBuilder, TableItem, Columns>(
                watchBuilder,
                cursorOptions,
                nextCursorValues,
                "prev", //reverse because watch query want between
                false,
                true
            );

            watchBuilder = addCursor<QueryBuilder, TableItem, Columns>(
                watchBuilder,
                cursorOptions,
                prevCursorValues,
                "next", //reverse because watch query want between
                false,
                true
            );

            if(!nextCursorValues && !prevCursorValues) {
                watchBuilder = watchBuilder.limit(perPage + 1) as QueryBuilder;
            }

            const cursors: Array<Cursor<QueryBuilder, Columns>> =
                Array.isArray(cursorOptions.cursor)
                ? cursorOptions.cursor
                : [cursorOptions.cursor];

            cursors.map((cursor) => {
                watchBuilder = addOrder<QueryBuilder, Columns>(
                    watchBuilder,
                    {
                        field: cursor.field,
                        direction: cursor.order ?? cursorOptions.defaultOrder ?? "asc",
                        reverse: false,
                        toLowerCase: cursor?.toLowerCase ?? false
                    }
                );
            });

            const compiled = watchBuilder.compile();
            const diffQuery = powersync.query<TableItem>({
                sql: compiled.sql,
                parameters: compiled.parameters as readonly QueryParam[]
            }).differentialWatch();

            const dispose = diffQuery.registerListener({
                onData: async (rows) => {
                    const tableRows = rows as unknown as Array<TableItem>;
                    const mappedRows = stableMapper
                                       ? await Promise.all(tableRows.map(stableMapper))
                                       : tableRows as unknown as Array<MappedItem>;

                    setData(mappedRows);
                    if(defaultItem) setInitialStartIndex(tableRows.findIndex(row => row?.[defaultItem.idField] === defaultItem.idValue));

                    if(tableRows.length > 0 && !nextCursorValues && !prevCursorValues) {
                        const firstItem = tableRows[0];
                        const lastItem = tableRows[tableRows.length - 1];

                        setNextCursor(lastItem);
                        setPrevCursor(firstItem);

                        setHasNext(tableRows.length >= perPage);
                        setHasPrev(!!defaultItem && tableRows.length >= perPage);
                    }

                    setIsLoading(false);
                },
                onError: (error) => console.log("UseInfiniteQuery diff query error: ", error)
            });

            return () => {
                dispose();
                diffQuery.close();
            };
        },
        [
            powersync,
            getBaseBuilder,
            nextCursorValues,
            prevCursorValues,
            perPage,
            cursorOptions,
            stableMapper,
            isDefaultCursorFetching
        ]
    );

    return {
        data,
        isLoading,
        isNextFetching,
        isPrevFetching,
        hasNext,
        hasPrev,
        fetchNext,
        fetchPrev,
        initialStartIndex,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField,
        filters,
        addFilter,
        replaceFilter,
        removeFilter,
        clearFilters
    };
};