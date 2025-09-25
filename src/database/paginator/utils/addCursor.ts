import { OrderByDirectionExpression, SelectQueryBuilder } from "kysely";
import { addOrder } from "./addOrder.ts";
import { getCursorOperator } from "./getCursorOperation.ts";
import { sql } from "@powersync/kysely-driver";
import { CursorDirection, CursorOptions, CursorValue } from "../CursorPaginator.ts";

export function addCursor<TableItem, DB>(
    query: SelectQueryBuilder<DB, TableItem, any>,
    cursorOptions: CursorOptions<keyof TableItem>,
    value: CursorValue<TableItem> | Array<CursorValue<TableItem>>,
    direction: CursorDirection
): SelectQueryBuilder<DB, TableItem, any> {
    let subQuery = query;

    if(Array.isArray(cursorOptions.field)) {
        cursorOptions.field.map((cursorField, index) => {
            let direction: OrderByDirectionExpression = "asc";
            if(cursorOptions.order && Array.isArray(cursorOptions.order)) {
                direction = cursorOptions.order?.[index] ?? "asc";
            } else if(cursorOptions.order) {
                direction = cursorOptions.order;
            }

            subQuery = addOrder<TableItem, DB>(subQuery, { field: cursorField, direction });
        });
    }

    if(direction === "initial") return subQuery;

    if(Array.isArray(cursorOptions.field) && !Array.isArray(value)) {
        throw new Error("If CursorField is array CursorValue must be Array as well to add cursor filter");
    }

    const operator = getCursorOperator(cursorOptions.order, direction);

    if(Array.isArray(cursorOptions.field) && Array.isArray(value)) {
        const tupleFields = sql.raw(cursorOptions.field.join(", "));
        const tupleValues = sql.join(value.map(v => sql`${ v }`));

        // @formatter:off
        return subQuery.where(sql`( ${ tupleFields } ) ${ sql.raw(operator) } ( ${ tupleValues } )`);
        // @formatter:on
    }

    return subQuery.where(cursorField, operator, value);
}