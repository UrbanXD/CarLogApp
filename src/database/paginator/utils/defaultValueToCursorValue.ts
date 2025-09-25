import { CursorOptions, CursorValue } from "../CursorPaginator.ts";

export function defaultValueToCursorValue<TableItem>(
    defaultValue: TableItem | null | undefined,
    field: CursorOptions<keyof TableItem>["field"]
): CursorValue<TableItem> {
    if(!defaultValue) return null;

    if(Array.isArray(field)) {
        return field.map((cursorField) => defaultValue?.[cursorField]);
    }

    return defaultValue?.[field];
}