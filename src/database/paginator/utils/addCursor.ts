import { OrderByDirectionExpression, SelectQueryBuilder, SqlBool } from "kysely";
import { addOrder } from "./addOrder.ts";
import { getCursorOperator } from "./getCursorOperation.ts";
import { sql } from "@powersync/kysely-driver";
import { CursorDirection, CursorOptions, CursorValue } from "../CursorPaginator.ts";
import { DatabaseType } from "../../connector/powersync/AppSchema.ts";

export function addCursor<TableItem>(
    table: keyof DatabaseType,
    query: SelectQueryBuilder<DatabaseType, any, TableItem>,
    cursorOptions: CursorOptions<keyof TableItem>,
    value: CursorValue<TableItem> | Array<CursorValue<TableItem>> | null,
    direction: CursorDirection
): SelectQueryBuilder<DatabaseType, any, TableItem> {
    const cursors = Array.isArray(cursorOptions.cursor) ? cursorOptions.cursor : [cursorOptions.cursor];
    const cursorValues: Array<CursorValue<TableItem>> | null = value ? Array.isArray(value) ? value : [value] : null;

    let subQuery = query;

    cursors.map((cursor) => {
        const orderDirection: OrderByDirectionExpression = cursor.order ?? cursorOptions.defaultOrder ?? "asc"
        ;
        // if table name is null that means no table name need (if undefined then set default table)
        const tableName = cursor?.table === null ? null : cursor?.table ?? table;
        const fieldName = tableName ? `${ String(tableName) }.${ String(cursor.field) }` : String(cursor.field);

        subQuery = addOrder<TableItem>(
            subQuery,
            {
                field: fieldName,
                direction: orderDirection,
                reverse: direction === "prev",
                toLowerCase: cursor?.toLowerCase ?? false
            }
        );
    });

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
    const cursorOperator = getCursorOperator(cursorOrders, direction);

    const tupleFields = sql.raw(cursors.map(cursor => {
        const tableName = cursor?.table === null ? null : cursor?.table ?? table;
        const fieldName = tableName ? [tableName, cursor.field].join(".") : String(cursor.field);

        if(cursor.toLowerCase) return `lower(${ fieldName })`;
        return fieldName;
    })
    .join(", "));

    const tupleValues = sql.join(cursorValues.map((v, index) => {
        const toLowerCase = cursors[index]?.toLowerCase ?? false;
        return toLowerCase ? sql`${ String(v).toLowerCase() }` : sql`${ String(v) }`;
    }));

    // @formatter:off
    return subQuery.where(sql<SqlBool>`( ${ tupleFields } ) ${ sql.raw(cursorOperator) } ( ${ tupleValues } )`);
    // @formatter:on
}