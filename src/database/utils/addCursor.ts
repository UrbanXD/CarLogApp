import { SelectQueryBuilder, SqlBool } from "kysely";
import { addOrder } from "./addOrder.ts";
import { getCursorOperator } from "./getCursorOperation.ts";
import { sql } from "@powersync/kysely-driver";
import {
    CursorDirection,
    CursorOptions,
    CursorValue,
    ExtractColumnsFromQuery,
    ExtractRowFromQuery
} from "../hooks/useInfiniteQuery.ts";

export function addCursor<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>(
    query: QueryBuilder,
    cursorOptions: CursorOptions<QueryBuilder, Columns>,
    value: CursorValue<TableItem> | Array<CursorValue<TableItem>> | null,
    direction: CursorDirection,
    shouldOrder: boolean = true,
    inclusive: boolean = false
): QueryBuilder {
    const cursors = Array.isArray(cursorOptions.cursor) ? cursorOptions.cursor : [cursorOptions.cursor];
    const cursorValues: Array<CursorValue<TableItem>> | null = value ? Array.isArray(value) ? value : [value] : null;

    let subQuery = query;

    if(shouldOrder) {
        cursors.map((cursor) => {
            subQuery = addOrder<QueryBuilder, Columns>(
                subQuery,
                {
                    field: cursor.field,
                    direction: cursor.order ?? cursorOptions.defaultOrder ?? "asc",
                    reverse: direction === "prev",
                    toLowerCase: cursor?.toLowerCase ?? false
                }
            );
        });
    }

    if(direction === "initial" || !cursorValues || cursorValues.length === 0) return subQuery;

    if(
        Array.isArray(cursorOptions.cursor) && !Array.isArray(value) ||
        !Array.isArray(cursorOptions.cursor) && Array.isArray(value)
    ) {
        throw new Error("If CursorField is array CursorValue must be Array as well to add cursor filter (vica versa)");
    }

    const cursorOrders = Array.isArray(cursorOptions.cursor)
                         ? cursorOptions.cursor.map(cursor => cursor.order ?? cursorOptions.defaultOrder ?? "asc")
                         : cursorOptions.cursor.order ?? cursorOptions.defaultOrder ?? "asc";

    const cursorOperator = getCursorOperator(cursorOrders, direction, inclusive);

    const tupleFields = sql.raw(cursors.map(cursor => {
        if(cursor.toLowerCase) return `lower(${ cursor.field })`;

        return cursor.field;
    })
    .join(", "));

    const tupleValues = sql.join(cursorValues.map((v, index) => {
        const toLowerCase = cursors[index]?.toLowerCase ?? false;

        let finalValue: string | CursorValue<TableItem> = v;
        if(toLowerCase && typeof finalValue === "string") {
            finalValue = String(finalValue).toLowerCase();
        }

        return sql`${ finalValue }`;
    }));

    // @formatter:off
    return subQuery.where(sql<SqlBool>`( ${ tupleFields } ) ${ sql.raw(cursorOperator) } ( ${ tupleValues } )`) as QueryBuilder;
    // @formatter:on
}