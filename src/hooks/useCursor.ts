import { useCallback, useState } from "react";
import { Cursor, CursorOptions } from "../database/paginator/CursorPaginator.ts";
import { DatabaseType, ExpenseTableRow } from "../database/connector/powersync/AppSchema.ts";
import { ICON_NAMES } from "../constants/index.ts";
import { arraySwapByIndex } from "../utils/arraySwapByIndex.ts";

export function useCursor<TableItem, DB = DatabaseType>(options: CursorOptions<keyof TableItem, DB>) {
    const [cursorOptions, setCursorOptions] = useState<CursorOptions<keyof TableItem, DB>>(options);

    const findCursorIndex = useCallback((
        cursors: Array<Cursor<keyof TableItem, DB>>,
        field: string,
        table?: keyof DB | null
    ) => {
        return cursors.findIndex((cursor) => cursor.field === field && cursor.table === table);
    });

    // first in cursor options if its an array
    const isMainCursor = useCallback((field: keyof TableItem, table?: keyof DB | null) => {
        return (
            Array.isArray(cursorOptions.cursor)
            ? cursorOptions.cursor[0].field === field && cursorOptions.cursor[0].table === table
            : cursorOptions.cursor.field === field && cursorOptions.cursor.table === table
        );
    }, [cursorOptions]);

    const makeFieldMainCursor = useCallback((field: keyof TableItem, table?: keyof DB | null) => {
        setCursorOptions(prev => {
            if(!Array.isArray(prev.cursor)) return prev; // it is not an array so we cannot change the order

            const fieldIndex = findCursorIndex(prev.cursor, field, table);
            if(fieldIndex === -1) return prev; // field is not cursor field

            return { ...prev, cursor: arraySwapByIndex(prev.cursor, fieldIndex, 0) };
        });
    }, []);

    const toggleFieldOrder = useCallback((field: keyof TableItem, table?: keyof DB | null) => {
        setCursorOptions(prev => {
            if(!Array.isArray(prev.cursor) && prev.cursor === field && cursor.table === table) { // cursor is not an array and field equals with cursor field
                const newCursor = { ...prev.cursor };
                newCursor.order = newCursor.order === "asc" ? "desc" : "asc";
                return { ...prev, cursor: newCursor };
            } else if(!Array.isArray(prev.cursor)) {
                return prev;
            }

            const fieldIndex = findCursorIndex(prev.cursor, field, table);
            if(fieldIndex === -1) return prev; // field is not cursor field

            const newCursor = [...prev.cursor];
            newCursor[fieldIndex] = {
                ...newCursor[fieldIndex],
                order: newCursor[fieldIndex].order === "asc" ? "desc" : "asc"
            } as Cursor<keyof TableItem, DB>;

            return { ...prev, cursor: newCursor };
        });
    }, []);

    const getOrderIconForField = (field: keyof ExpenseTableRow, table?: keyof DB | null) => {
        if(!Array.isArray(cursorOptions.cursor) && cursorOptions.cursor.field === field && cursorOptions.cursor.table === table) { // cursor is not an array and field equals with cursor field
            return cursorOptions.cursor.order === "asc" ? ICON_NAMES.upArrow : ICON_NAMES.downArrow;
        } else if(!Array.isArray(cursorOptions.cursor)) {
            return "help";
        }

        const fieldIndex = findCursorIndex(cursorOptions.cursor, field, table);
        if(fieldIndex === -1) return "help"; // default

        return cursorOptions.cursor[fieldIndex].order === "asc"
               ? ICON_NAMES.upArrow
               : ICON_NAMES.downArrow;
    };

    return {
        cursorOptions,
        isMainCursor,
        makeFieldMainCursor,
        toggleFieldOrder,
        getOrderIconForField
    };
}