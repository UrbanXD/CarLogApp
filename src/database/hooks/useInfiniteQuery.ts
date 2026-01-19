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
import { DatabaseType } from "../connector/powersync/AppSchema";
import { QueryParam } from "@powersync/react-native";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";
import { getCursorValues } from "../utils/getCursorValues.ts";
import { addCursor } from "../utils/addCursor.ts";
import { addOrder } from "../utils/addOrder.ts";

export type CursorDirection = "initial" | "next" | "prev";

export type CursorValue<TableItem> = TableItem[keyof TableItem];

export type Cursor<TableField> = {
    field: TableField,
    table?: keyof DatabaseType | string | null,
    order?: OrderByDirectionExpression,
    toLowerCase?: boolean
}

export type CursorOptions<TableField> = {
    cursor: Cursor<TableField> | Array<Cursor<TableField>>,
    defaultOrder?: OrderByDirectionExpression
}

export type FilterCondition<TableItem> = {
    field: keyof TableItem
    operator: ComparisonOperatorExpression
    value: any
    table?: keyof DatabaseType | string | null
    customSql?: (fieldRef: string | RawBuilder<any>) => RawBuilder<any>
}

export type FilterGroup<TableItem> = {
    logic: "AND" | "OR"
    filters: Array<FilterCondition<TableItem>>
}

export type UseInfiniteQueryOptions<TableItem extends { id: any }, MappedItem> = {
    cursorOptions: CursorOptions<keyof TableItem>
    table?: keyof DatabaseType | string
    baseQuery?: SelectQueryBuilder<DatabaseType, any, TableItem>
    filters?: Map<string, FilterGroup<TableItem>>
    defaultItemId?: any
    perPage?: number
    mapper?: (item: TableItem, index: number) => MappedItem | Promise<MappedItem>
}

export const useInfiniteQuery = <TableItem extends { id: string }, MappedItem = TableItem>({
    cursorOptions,
    table,
    baseQuery,
    filters,
    defaultItemId,
    perPage = 15,
    mapper
}: UseInfiniteQueryOptions<TableItem, MappedItem>) => {
    const { db, powersync } = useDatabase();

    const stringifiedCursors = JSON.stringify(cursorOptions);
    const stringifiedMapper = JSON.stringify(mapper);
    const stableCursorOptions = useMemo(() => cursorOptions, [stringifiedCursors]);
    const stableMapper = useMemo(() => mapper, [stringifiedMapper]);

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
        let query: SelectQueryBuilder<DatabaseType, any, TableItem>;

        if(baseQuery) {
            query = baseQuery as SelectQueryBuilder<DatabaseType, any, TableItem>;
        } else {

            const isValidTable = table !== "";

            if(!isValidTable) {
                throw new Error("Missing base query and cannot generate selection: 'table' is invalid or missing.");
            }

            try {
                query = db
                .selectFrom(table as keyof DatabaseType)
                .selectAll() as unknown as SelectQueryBuilder<DatabaseType, any, TableItem>;
            } catch(e) {
                throw new Error(`Generation failed: The table "${ table }" is not a valid key of DatabaseType.`);
            }
        }

        filters?.forEach((group) => {
            if(group.filters.length === 0) return;

            query = query.where((eb) => {
                const expressions: Expression<SqlBool>[] = [];

                group.filters.forEach((filter) => {
                    const fieldName = `${ String(filter?.table ?? table) }.${ String(filter.field) }`;
                    const filterField = sql.ref(fieldName);

                    const operand = filter.customSql
                                    ? filter.customSql(filterField)
                                    : filterField;

                    expressions.push(eb.eb(operand, filter.operator, filter.value));
                });

                if(group.logic.toUpperCase() === "OR") {
                    return eb.or(expressions);
                }

                return eb.and(expressions);
            });
        });

        const cursors = Array.isArray(stableCursorOptions.cursor)
                        ? stableCursorOptions.cursor
                        : [stableCursorOptions.cursor];

        cursors.forEach((cursor) => {
            const tableName = cursor?.table === null ? null : cursor?.table ?? table;
            const fieldPath = tableName ? `${ String(tableName) }.${ String(cursor.field) }` : String(cursor.field);

            query = query.select(sql.ref(fieldPath) as any);
        });

        return query;
    }, [db, table, stableCursorOptions, filters]);

    const setNextCursor = useCallback((lastItem: TableItem) => {
        setNextCursorValues(getCursorValues(lastItem, stableCursorOptions));
    }, [stableCursorOptions]);

    const setPrevCursor = useCallback((firstItem: TableItem) => {
        setPrevCursorValues(getCursorValues(firstItem, stableCursorOptions));
    }, [stableCursorOptions]);

    const fetchNext = useCallback(
        async () => {
            if(isNextFetching || (data.length > 0 && !hasNext)) return;
            setIsNextFetching(true);

            try {
                let nextBuilder = getBaseBuilder().limit(perPage + 1);
                nextBuilder = addCursor(table, nextBuilder, stableCursorOptions, nextCursorValues, "next");

                const compiled = nextBuilder.compile();
                const results = await powersync.getAll<TableItem>(compiled.sql, compiled.parameters as any[]);

                const hasMore = results.length > perPage;
                if(hasMore) results.pop();

                const nextCursor = hasMore ? results[results.length - 1] : null;

                if(results.length > 0) {
                    const mapped = stableMapper
                                   ? await Promise.all(results.map(stableMapper))
                                   : results as unknown as Array<MappedItem>;

                    setData(prev => [...prev, ...mapped]);
                }

                setHasNext(hasMore);
                if(nextCursor) setNextCursor(nextCursor);
                if(!prevCursorValues && results.length > 0) setPrevCursor(results[0]);
            } finally {
                setIsNextFetching(false);
            }
        },
        [
            isNextFetching,
            hasNext,
            data.length,
            nextCursorValues,
            getBaseBuilder,
            stableCursorOptions,
            perPage,
            stableMapper,
            prevCursorValues,
            powersync,
            setPrevCursor,
            setNextCursor
        ]
    );

    const fetchPrev = useCallback(async () => {
        if(isPrevFetching || !hasPrev) return;
        setIsPrevFetching(true);

        try {
            let prevBuilder = getBaseBuilder().limit(perPage + 1);
            prevBuilder = addCursor(table, prevBuilder, stableCursorOptions, prevCursorValues, "prev");

            const compiled = prevBuilder.compile();
            const rawResults = (await powersync.getAll<TableItem>(compiled.sql, compiled.parameters as any[]));
            const results = [...rawResults].reverse();

            const hasMore = results.length > perPage;
            if(hasMore) results.unshift();

            const prevCursor = hasMore ? results[results.length - 1] : null;

            if(results.length > 0) {
                const mapped = stableMapper
                               ? await Promise.all(results.map(stableMapper))
                               : results as unknown as Array<MappedItem>;

                setData(prev => [...mapped, ...prev]); // Lista elejére fűzzük
            }

            if(prevCursor) setPrevCursor(prevCursor);
            if(!nextCursorValues && results.length > 0) setNextCursor(results[results.length - 1]);
            setHasPrev(hasMore);
        } finally {
            setIsPrevFetching(false);
        }
    }, [
        isPrevFetching,
        hasPrev,
        prevCursorValues,
        nextCursorValues,
        getBaseBuilder,
        stableCursorOptions,
        table,
        perPage,
        stableMapper,
        powersync,
        setPrevCursor,
        setNextCursor
    ]);

    useEffect(() => {
        const setupInitialCursors = async () => {
            if(isDefaultCursorFetching) return;

            setIsLoading(true);
            setData([]);
            setNextCursorValues(null);
            setPrevCursorValues(null);

            if(defaultItemId) {
                setIsDefaultCursorFetching(true);

                const filterField = sql.ref(`${ table }.id`);
                const result = await getBaseBuilder()
                .where(filterField, "=", defaultItemId)
                .executeTakeFirst();

                const defaultItem = (result as TableItem) ?? null;

                if(defaultItem) {
                    const defaultCursorValues = getCursorValues(defaultItem, stableCursorOptions);

                    const [nextRes, prevRes] = await Promise.all([
                        addCursor(
                            table,
                            getBaseBuilder().limit(perPage),
                            stableCursorOptions,
                            defaultCursorValues,
                            "next"
                        )
                        .execute(),
                        addCursor(
                            table,
                            getBaseBuilder().limit(perPage),
                            stableCursorOptions,
                            defaultCursorValues,
                            "prev"
                        )
                        .execute()
                    ]);

                    const farNextItem = nextRes.length > 0 ? nextRes[nextRes.length - 1] : defaultItem;
                    const farPrevItem = prevRes.length > 0 ? prevRes[prevRes.length - 1] : null;

                    setNextCursorValues(getCursorValues(farNextItem ?? defaultItem, stableCursorOptions));
                    setPrevCursorValues(farPrevItem ? getCursorValues(farPrevItem, stableCursorOptions) : null);
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
    }, [defaultItemId, getBaseBuilder]);

    useEffect(
        () => {
            if(isDefaultCursorFetching) return;

            let watchBuilder = getBaseBuilder();

            watchBuilder = addCursor<TableItem>(
                table,
                watchBuilder,
                stableCursorOptions,
                nextCursorValues,
                "prev", //reverse because watch query want between
                false
            );

            watchBuilder = addCursor<TableItem>(
                table,
                watchBuilder,
                stableCursorOptions,
                prevCursorValues,
                "next", //reverse because watch query want between
                false
            );

            if(!nextCursorValues && !prevCursorValues) {
                watchBuilder = watchBuilder.limit(perPage + 1);
            }

            const cursors = Array.isArray(stableCursorOptions.cursor)
                            ? stableCursorOptions.cursor
                            : [stableCursorOptions.cursor];
            cursors.map((cursor) => {
                const orderDirection: OrderByDirectionExpression = cursor.order ?? stableCursorOptions.defaultOrder ?? "asc";
                // if table name is null that means no table name need (if undefined then set default table)
                const tableName = cursor?.table === null ? null : cursor?.table ?? table;
                const fieldName = tableName ? `${ String(tableName) }.${ String(cursor.field) }` : String(cursor.field);

                watchBuilder = addOrder<TableItem>(
                    watchBuilder,
                    {
                        field: fieldName,
                        direction: orderDirection,
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
                    const tableRows = rows as unknown as TableItem[];
                    const mappedRows = stableMapper
                                       ? await Promise.all(tableRows.map(stableMapper))
                                       : tableRows as unknown as MappedItem[];

                    setData(mappedRows);
                    setIsLoading(false);
                    if(defaultItemId) setInitialStartIndex(tableRows.findIndex(row => row.id === defaultItemId));

                    if(tableRows.length > 0 && !nextCursorValues && !prevCursorValues) {
                        const firstItem = tableRows[0];
                        const lastItem = tableRows[tableRows.length - 1];

                        setNextCursor(lastItem);
                        setPrevCursor(firstItem);

                        if(tableRows.length >= perPage) setHasNext(true);
                        if(tableRows.length >= perPage) setHasPrev(true);
                    }
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
            setNextCursor,
            setPrevCursor,
            perPage,
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
        initialStartIndex
    };
};