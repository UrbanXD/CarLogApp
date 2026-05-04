import { CursorOptions, CursorValue, ExtractColumnsFromQuery, ExtractRowFromQuery } from "../hooks/useInfiniteQuery.ts";
import { SelectQueryBuilder } from "kysely";
import { getFieldName } from "./getFieldName.ts";

export function getCursorValues<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    TableItem = ExtractRowFromQuery<QueryBuilder>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>(
    item: TableItem,
    cursorOptions: CursorOptions<QueryBuilder, Columns>
): CursorValue<TableItem> | Array<CursorValue<TableItem>> {
    if(Array.isArray(cursorOptions.cursor)) {
        return cursorOptions.cursor.map((cursor) => {
            return item[getFieldName<keyof TableItem>(String(cursor?.alias ?? cursor.field))];
        });
    } else {
        return item[getFieldName<keyof TableItem>(String(cursorOptions.cursor?.alias ?? cursorOptions.cursor.field))];
    }
}