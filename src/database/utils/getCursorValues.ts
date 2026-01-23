import { CursorOptions, CursorValue, ExtractColumnsFromQuery, ExtractRowFromQuery } from "../hooks/useInfiniteQuery.ts";
import { SelectQueryBuilder } from "kysely";

export function getCursorValues<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>(
    item: TableItem,
    cursorOptions: CursorOptions<QueryBuilder, Columns>
): CursorValue<TableItem> | Array<CursorValue<TableItem>> {
    const getKey = (field: string) => (field.includes(".") ? field.split(".").pop() : field) as keyof TableItem;

    if(Array.isArray(cursorOptions.cursor)) {
        return cursorOptions.cursor.map((cursor) => item[getKey(String(cursor.field))]);
    } else {
        return item[getKey(String(cursorOptions.cursor.field))];
    }
}