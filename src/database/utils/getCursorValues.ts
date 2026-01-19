import { CursorOptions, CursorValue } from "../../hooks/useInfiniteQuery.ts";

export function getCursorValues<TableItem>(
    item: TableItem,
    cursorOptions: CursorOptions<keyof TableItem>
): CursorValue<TableItem> | Array<CursorValue<TableItem>> {
    if(Array.isArray(cursorOptions.cursor)) {
        return cursorOptions.cursor.map((cursor) => item[cursor.field]);
    } else {
        return item[cursorOptions.cursor.field];
    }
}