import { OrderByDirectionExpression, SelectQueryBuilder } from "kysely";
import { addOrder } from "./addOrder.ts";
import { getCursorOperator } from "./getCursorOperation.ts";
import { sql } from "@powersync/kysely-driver";
import { CursorDirection, CursorOptions, CursorValue } from "../CursorPaginator.ts";
import { DatabaseType } from "../../connector/powersync/AppSchema.ts";

export function addCursor<TableItem, DB = DatabaseType>(
    table: keyof DB,
    query: SelectQueryBuilder<DB, TableItem, any>,
    cursorOptions: CursorOptions<keyof TableItem, DB>,
    value: CursorValue<TableItem> | Array<CursorValue<TableItem>>,
    direction: CursorDirection
): SelectQueryBuilder<DB, TableItem, any> {
    let subQuery = query;

    if(Array.isArray(cursorOptions.cursor)) {
        cursorOptions.cursor.map((cursor) => {
            const orderDirection: OrderByDirectionExpression = cursor.order ?? cursorOptions.defaultOrder ?? "asc";

            // if table name is null that means no table name need (if undefined then set default table)
            const tableName = cursor?.table === null ? null : cursor?.table ?? table;
            const fieldName = tableName ? [tableName, cursor.field].join(".") : cursor.field;

            subQuery = addOrder<TableItem, DB>(
                subQuery,
                {
                    field: fieldName,
                    direction: orderDirection,
                    reverse: direction === "prev",
                    toLowerCase: cursor?.toLowerCase ?? false
                }
            );
        });
    } else {
        const orderDirection: OrderByDirectionExpression = cursorOptions.cursor?.order ?? cursorOptions.defaultOrder ?? "asc";

        const tableName = cursor?.table === null ? null : cursor?.table ?? table;
        const fieldName = tableName ? [tableName, cursor.field].join(".") : cursor.field;

        subQuery = addOrder<TableItem, DB>(
            subQuery,
            {
                field: fieldName,
                direction: orderDirection,
                reverse: direction === "prev",
                toLowerCase: cursorOptions.cursor?.toLowerCase ?? false
            }
        );
    }

    if(direction === "initial" || !value) return subQuery;

    if(
        Array.isArray(cursorOptions.cursor) && !Array.isArray(value)
        ||
        !Array.isArray(cursorOptions.cursor) && Array.isArray(value)
    ) {
        throw new Error("If CursorField is array CursorValue must be Array as well to add cursor filter (vica versa)");
    }

    const cursorOrders = Array.isArray(cursorOptions.cursor)
                         ? cursorOptions.cursor.map(cursor => cursor.order ?? cursorOptions.defaultOrder)
                         : cursorOptions.cursor.order ?? cursorOptions.defaultOrder ?? "asc";
    const cursorOperator = getCursorOperator(cursorOrders, direction);

    if(Array.isArray(cursorOptions.cursor)) {
        const tupleFields = sql.raw(cursorOptions.cursor.map(cursor => {
            const tableName = cursor?.table === null ? null : cursor?.table ?? table;
            const fieldName = tableName ? [tableName, cursor.field].join(".") : cursor.field;

            if(cursor.toLowerCase) return `lower(${ fieldName })`;
            return fieldName;
        })
        .join(", "));
        const tupleValues = sql.join(value.map((v, index) => {
            const toLowerCase = cursorOptions.cursor?.[index]?.toLowerCase ?? false;
            return toLowerCase ? sql`${ v.toLowerCase() }` : sql`${ v }`;
        }));

        // @formatter:off
        return subQuery.where(sql`( ${ tupleFields } ) ${ sql.raw(cursorOperator) } ( ${ tupleValues } )`);
        // @formatter:on
    }

    const tableName = cursorOptions.cursor.table === null ? null : cursorOptions.cursor.table ?? table;
    const fieldName = tableName ? [tableName, cursorOptions.cursor.field].join(".") : cursorOptions.cursor.field;

    const cursorField = sql.raw(cursorOptions.cursor.toLowerCase ? `lower(${ fieldName })` : fieldName);

    return subQuery.where(cursorField, cursorOperator, value);
}