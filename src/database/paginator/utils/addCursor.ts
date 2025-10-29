import { OrderByDirectionExpression, SelectQueryBuilder } from "kysely";
import { addOrder } from "./addOrder.ts";
import { getCursorOperator } from "./getCursorOperation.ts";
import { sql } from "@powersync/kysely-driver";
import { CursorDirection, CursorOptions, CursorValue } from "../CursorPaginator.ts";

export function addCursor<TableItem, DB>(
    table: keyof DB,
    query: SelectQueryBuilder<DB, TableItem, any>,
    cursorOptions: CursorOptions<DB, keyof TableItem>,
    value: CursorValue<TableItem> | Array<CursorValue<TableItem>>,
    direction: CursorDirection
): SelectQueryBuilder<DB, TableItem, any> {
    let subQuery = query;

    if(Array.isArray(cursorOptions.cursor)) {
        cursorOptions.cursor.map((cursor) => {
            const orderDirection: OrderByDirectionExpression = cursor.order ?? cursorOptions.defaultOrder ?? "asc";

            const tableName = cursor.table ?? table;
            let fieldName = `${ tableName }.${ cursor.field }`;
            if(cursor.table === null) fieldName = cursor.field; // if table name is null that means no table name need (if undefined then set default table)

            subQuery = addOrder<TableItem, DB>(
                subQuery,
                { field: fieldName, direction: orderDirection, reverse: direction === "prev" }
            );
        });
    } else {
        const orderDirection: OrderByDirectionExpression = cursor.order ?? cursorOptions.defaultOrder ?? "asc";

        const tableName = cursorOptions.cursor.table ?? table;
        let fieldName = `${ tableName }.${ cursorOptions.cursor }`;
        if(cursor.table === null) fieldName = cursorOptions.cursor;

        subQuery = addOrder<TableItem, DB>(
            subQuery,
            {
                field: fieldName,
                direction: orderDirection,
                reverse: direction === "prev"
            }
        );
    }

    if(direction === "initial") return subQuery;

    if(Array.isArray(cursorOptions.cursor) && !Array.isArray(value)) {
        throw new Error("If CursorField is array CursorValue must be Array as well to add cursor filter");
    }

    const cursorOrders = Array.isArray(cursorOptions.cursor)
                         ? cursorOptions.cursor.map(cursor => cursor.order ?? cursorOptions.defaultOrder)
                         : cursorOptions.cursor.order ?? cursorOptions.defaultOrder ?? "asc";
    const cursorOperator = getCursorOperator(cursorOrders, direction);

    if(Array.isArray(cursorOptions.cursor) && Array.isArray(value)) {
        const tupleFields = sql.raw(cursorOptions.cursor.map(cursor => `"${ cursor.table ?? table }"."${ cursor.field }"`)
        .join(", "));
        const tupleValues = sql.join(value.map(v => sql`${ v }`));

        // @formatter:off
        return subQuery.where(sql`( ${ tupleFields } ) ${ sql.raw(cursorOperator) } ( ${ tupleValues } )`);
        // @formatter:on
    }

    return subQuery.where(cursorField, cursorOperator, value);
}