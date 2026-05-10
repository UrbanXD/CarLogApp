import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { jsonFieldsParse } from "../utils/jsonFieldsParse.ts";
import { sql } from "@powersync/kysely-driver";

export type CursorDirection = "initial" | "next" | "prev";

export type CursorValue<TableItem> = TableItem[keyof TableItem];

export type CursorExtraOrderByField<Columns> = {
    field: Columns
    reverseOrder?: boolean
    toLowerCase?: boolean
}

export type Cursor<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    field: Columns
    alias?: string
    order?: OrderByDirectionExpression
    toLowerCase?: boolean
    extraOrderByField?: CursorExtraOrderByField<Columns> | Array<CursorExtraOrderByField<Columns>>
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
                                                        | Extract<keyof ExtractRowFromQuery<QueryBuilder>, string>
                                                    : never;

export type UseInfiniteQueryOptions<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MappedItem,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    baseQuery: QueryBuilder,
    defaultCursorOptions: CursorOptions<QueryBuilder, Columns>
    defaultFilters?: Array<FilterGroup<QueryBuilder, Columns> & { key: string }>
    defaultItem?: { idField: keyof TableItem, idValue: any } | null
    idField?: Columns
    perPage?: number
    mapper?: (item: TableItem, index?: number) => MappedItem | Promise<MappedItem>
    mappedItemId?: keyof MappedItem
    jsonFields?: Array<keyof TableItem>
    enabled?: boolean
}

export const useInfiniteQuery = <
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MappedItem = ExtractRowFromQuery<QueryBuilder>,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>(props: UseInfiniteQueryOptions<QueryBuilder, MappedItem, TableItem, Columns> | null) => {
    const {
        defaultCursorOptions,
        baseQuery,
        defaultFilters,
        defaultItem,
        perPage = 25,
        mapper,
        mappedItemId,
        jsonFields,
        enabled = true
    } = props ?? {};

    const { powersync } = useDatabase();

    const hadNext = useRef(false);
    const hadPrev = useRef(false);

    const stringifiedMapper = JSON.stringify(mapper);
    const stableMapper = useMemo(() => mapper, [stringifiedMapper]);
    const memoizedDefaultFilters = useMemo(() => defaultFilters ?? [], [defaultFilters]);

    const {
        cursorOptions,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField
    } = useCursor<QueryBuilder, Columns>(defaultCursorOptions);

    const {
        filters,
        addFilter,
        replaceFilter,
        removeFilter,
        clearFilters
    } = useFilters(memoizedDefaultFilters);

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
        if(!baseQuery || !enabled) return null;

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

        return query;
    }, [cursorOptions, filters, enabled]);

    const setNextCursor = useCallback((lastItem: TableItem) => {
        if(!cursorOptions) return;

        setNextCursorValues(getCursorValues(lastItem, cursorOptions));
    }, [cursorOptions]);

    const setPrevCursor = useCallback((firstItem: TableItem) => {
        if(!cursorOptions) return;

        setPrevCursorValues(getCursorValues(firstItem, cursorOptions));
    }, [cursorOptions]);

    const getUniqueNewItems = useCallback((oldItems: Array<MappedItem>, newItems: Array<MappedItem>) => (
        newItems.filter(newItem => {
            const newId = newItem?.[mappedItemId ?? "id" as keyof MappedItem];

            if(newId === undefined || newId === null) {
                console.warn(`Missing ID in new item using key: ${ String(mappedItemId) }`, newItem);
                return false;
            }

            return !oldItems.some(oldItem => oldItem?.[mappedItemId ?? "id" as keyof MappedItem] === newId);
        })
    ), [mappedItemId]);

    const fetchNext = useCallback(
        async (force?: boolean) => {
            if(!cursorOptions || !enabled || isNextFetching || isLoading) return;
            if(!force && !hasNext) return;

            setIsNextFetching(true);

            try {
                const base = getBaseBuilder();
                if(!base) return;

                let nextBuilder = base.limit(perPage);
                nextBuilder = addCursor(nextBuilder, cursorOptions, nextCursorValues, "next");

                const compiled = nextBuilder.compile();
                const results = await powersync.getAll<TableItem>(compiled.sql, compiled.parameters as any[]);

                if(results.length > 0) {
                    setNextCursor(results[results.length - 1]);
                }
            } catch(error) {
                console.log("Fetch next infinite query error: ", error);
            } finally {
                setIsNextFetching(false);
                hadNext.current = false;
            }
        },
        [
            enabled, isLoading, isNextFetching, hasNext, data.length, nextCursorValues, getBaseBuilder, cursorOptions,
            perPage, stableMapper, prevCursorValues, powersync, setPrevCursor, setNextCursor, getUniqueNewItems,
            jsonFields
        ]
    );

    const fetchPrev = useCallback(async (force?: boolean) => {
        if(!cursorOptions || !enabled || isPrevFetching || isLoading) return;
        if(!force && !hasPrev) return;

        setIsPrevFetching(true);

        try {
            const base = getBaseBuilder();
            if(!base) return;

            let prevBuilder = base.limit(perPage);
            prevBuilder = addCursor(prevBuilder, cursorOptions, prevCursorValues, "prev");

            const compiled = prevBuilder.compile();
            const results = await powersync.getAll<TableItem>(compiled.sql, compiled.parameters as any[]);

            if(results.length > 0) {
                setPrevCursor(results[results.length - 1]);
            }
        } catch(error) {
            console.log("Fetch prev infinite query error: ", error);
        } finally {
            setIsPrevFetching(false);
            hadPrev.current = false;
        }
    }, [
        enabled,
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
        getUniqueNewItems,
        jsonFields
    ]);

    const diffQuery = useMemo(() => {
        if(!cursorOptions || isDefaultCursorFetching) return null;

        const base = getBaseBuilder();

        if(!base) return null;

        let watchBuilder = base;

        //reverse direction because watch query want between
        if(prevCursorValues) {
            watchBuilder = addCursor<QueryBuilder, TableItem, Columns>(
                watchBuilder, cursorOptions, prevCursorValues, "next", false, true
            );
        }

        if(nextCursorValues && prevCursorValues !== nextCursorValues) {
            watchBuilder = addCursor<QueryBuilder, TableItem, Columns>(
                watchBuilder, cursorOptions, nextCursorValues, "prev", false, true
            );
        }

        if((!nextCursorValues && !prevCursorValues) || prevCursorValues === nextCursorValues) {
            watchBuilder = watchBuilder.limit(perPage) as QueryBuilder;
        }

        const cursors =
            Array.isArray(cursorOptions.cursor)
            ? cursorOptions.cursor
            : [cursorOptions.cursor];

        cursors.forEach((cursor) => {
            watchBuilder = addOrder<QueryBuilder, Columns>(watchBuilder, {
                field: cursor.field,
                direction: cursor.order ?? cursorOptions.defaultOrder ?? "asc",
                reverse: false,
                toLowerCase: cursor?.toLowerCase ?? false
            });

            if(cursor.extraOrderByField) {
                const extraOrderByFields = Array.isArray(cursor.extraOrderByField)
                                           ? cursor.extraOrderByField
                                           : [cursor.extraOrderByField];

                extraOrderByFields.forEach((extraOrder) => watchBuilder = addOrder<QueryBuilder, Columns>(
                    watchBuilder,
                    {
                        field: extraOrder.field,
                        direction: cursor.order ?? cursorOptions.defaultOrder ?? "asc",
                        reverse: extraOrder.reverseOrder,
                        toLowerCase: extraOrder.toLowerCase
                    }
                ));
            }
        });

        const compiled = watchBuilder.compile();
        return powersync.query<TableItem>({
            sql: compiled.sql,
            parameters: compiled.parameters as readonly QueryParam[]
        }).differentialWatch();
    }, [getBaseBuilder, cursorOptions, nextCursorValues, prevCursorValues, perPage, isDefaultCursorFetching]);

    const hasPrevQuery = useMemo(() => {
        if(!cursorOptions || isLoading || isPrevFetching || !prevCursorValues) return null;

        let watchBuilder = getBaseBuilder();

        if(!watchBuilder) return null;

        watchBuilder = addCursor<QueryBuilder, TableItem, Columns>(
            watchBuilder, cursorOptions, prevCursorValues, "prev", false
        );

        const compiled = watchBuilder.clearLimit().limit(1).compile();
        return powersync.query<TableItem>({
            sql: compiled.sql,
            parameters: compiled.parameters as readonly QueryParam[]
        }).differentialWatch();
    }, [getBaseBuilder, cursorOptions, prevCursorValues, isLoading, isPrevFetching]);

    const hasNextQuery = useMemo(() => {
        if(!cursorOptions || isLoading || isNextFetching || !nextCursorValues) return null;

        let watchBuilder = getBaseBuilder();

        if(!watchBuilder) return null;
        watchBuilder = addCursor<QueryBuilder, TableItem, Columns>(
            watchBuilder, cursorOptions, nextCursorValues, "next", false
        );

        const compiled = watchBuilder.clearLimit().limit(1).compile();
        return powersync.query<TableItem>({
            sql: compiled.sql,
            parameters: compiled.parameters as readonly QueryParam[]
        }).differentialWatch();
    }, [getBaseBuilder, cursorOptions, nextCursorValues, isLoading, isNextFetching]);

    useEffect(() => {
        const setupInitialCursors = async () => {
            if(!cursorOptions || !enabled || isDefaultCursorFetching) return;

            setIsLoading(true);
            setData([]);

            if(defaultItem) {
                const base = getBaseBuilder();
                if(!base) return;

                setIsDefaultCursorFetching(true);

                const result = await base
                .where(sql.ref(String(defaultItem.idField)), "=", defaultItem.idValue)
                .executeTakeFirst();

                const tableDefaultItem = (result as TableItem) ?? null;

                if(tableDefaultItem) {
                    const parsedDefaultItem = jsonFieldsParse(tableDefaultItem, jsonFields);
                    const defaultCursorValues = getCursorValues(parsedDefaultItem, cursorOptions);

                    const [nextRes, prevRes] = await Promise.all([
                        addCursor(
                            base.limit(perPage),
                            cursorOptions,
                            defaultCursorValues,
                            "next"
                        )
                        .execute(),
                        addCursor(
                            base.limit(perPage),
                            cursorOptions,
                            defaultCursorValues,
                            "prev"
                        )
                        .execute()
                    ]);

                    const farNextItem = nextRes.length > 0 ? nextRes[nextRes.length - 1] : null;
                    const farPrevItem = prevRes.length > 0 ? prevRes[prevRes.length - 1] : null;

                    const parsedFarNextItem = farNextItem ? jsonFieldsParse(farNextItem, jsonFields) : null;
                    const parsedFarPrevItem = farPrevItem ? jsonFieldsParse(farPrevItem, jsonFields) : null;

                    setNextCursorValues(getCursorValues<QueryBuilder, TableItem, Columns>(
                        parsedFarNextItem ?? parsedDefaultItem,
                        cursorOptions
                    ));
                    setPrevCursorValues(parsedFarPrevItem ? getCursorValues<QueryBuilder, TableItem, Columns>(
                        parsedFarPrevItem,
                        cursorOptions
                    ) : null);

                    setHasNext(nextRes.length === perPage);
                    setHasPrev(prevRes.length === perPage);
                }

                setIsDefaultCursorFetching(false);
            }
        };

        setupInitialCursors();
    }, [defaultItem, getBaseBuilder, jsonFields]);

    useEffect(
        () => {
            if(!diffQuery || !enabled) return;

            const dispose = diffQuery.registerListener({
                onData: async (rows) => {
                    try {
                        const tableRows = rows as unknown as Array<TableItem>;
                        const parsedTableRow = tableRows.map(row => jsonFieldsParse(row, jsonFields));

                        const mappedRows = stableMapper
                                           ? await Promise.all(parsedTableRow.map(stableMapper))
                                           : parsedTableRow as unknown as Array<MappedItem>;

                        setData(mappedRows);
                        if(defaultItem) setInitialStartIndex(parsedTableRow.findIndex(row => row?.[defaultItem.idField] === defaultItem.idValue));

                        if(!defaultItem && parsedTableRow.length > 0) {
                            if(!nextCursorValues) {
                                const lastItem = parsedTableRow[parsedTableRow.length - 1];
                                setNextCursor(lastItem);
                            }
                        }

                        if(parsedTableRow.length === 0 && (nextCursorValues || prevCursorValues)) {
                            setNextCursorValues(null);
                            setPrevCursorValues(null);
                        }
                    } catch(error) {
                        console.log("Use infinite query diff onData error: ", error);
                    } finally {
                        setIsLoading(false);
                    }
                },
                onStateChange: (state) => {
                    if(!state.error && !state.isFetching && !state.isFetching && state.data.length === 0) {
                        setIsLoading(false);
                    }
                },
                onError: (error) => {
                    console.log("UseInfiniteQuery diff query error: ", error);
                    setIsLoading(false);
                }
            });

            return () => {
                dispose();
                diffQuery.close();
            };
        },
        [enabled, diffQuery, stableMapper, jsonFields]
    );

    useEffect(
        () => {
            if(!hasPrevQuery || !enabled) return;

            const dispose = hasPrevQuery.registerListener({
                onData: async (rows) => {
                    const has = rows && rows.length > 0;
                    setHasPrev(has);

                    if(has && !hadPrev.current) await fetchPrev(true);
                    hadPrev.current = has;
                },
                onError: (error) => {
                    console.log("UseInfiniteQuery hasNext query error: ", error);
                }
            });

            return () => {
                dispose();
                hasPrevQuery.close();
            };
        },
        [enabled, hasPrevQuery]
    );

    useEffect(
        () => {
            if(!hasNextQuery || !enabled) return;

            const dispose = hasNextQuery.registerListener({
                onData: async (rows) => {
                    const has = rows && rows.length > 0;
                    setHasNext(has);

                    if(has && !hadNext.current) await fetchNext(true);
                    hadNext.current = has;
                },
                onError: (error) => {
                    console.log("UseInfiniteQuery hasNext query error: ", error);
                }
            });

            return () => {
                dispose();
                hasNextQuery.close();
            };
        },
        [enabled, hasNextQuery]
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