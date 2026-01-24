import { useCallback, useEffect, useState } from "react";
import { Cursor, CursorOptions, ExtractColumnsFromQuery } from "./useInfiniteQuery.ts";
import { arraySwapByIndex } from "../../utils/arraySwapByIndex.ts";
import { ICON_NAMES } from "../../constants";
import { SelectQueryBuilder } from "kysely";

export function useCursor<QueryBuilder extends SelectQueryBuilder<any, any, any>, Columns = ExtractColumnsFromQuery<QueryBuilder>>(options?: CursorOptions<QueryBuilder, Columns> | null) {
    const [cursorOptions, setCursorOptions] = useState<CursorOptions<QueryBuilder, Columns> | null>(options ?? null);

    useEffect(() => {
        setCursorOptions(options ?? null);
    }, [options]);

    const findCursorIndex = useCallback((cursors: Array<Cursor<QueryBuilder, Columns>>, field: Columns) => {
        return cursors.findIndex((cursor) => cursor.field === field);
    }, []);

    // first in cursor options if it is an array
    const isMainCursor = useCallback((field: Columns) => {
        if(!cursorOptions) return false;

        return Array.isArray(cursorOptions.cursor)
               ? cursorOptions.cursor?.[0].field === field
               : cursorOptions.cursor.field === field;
    }, [cursorOptions]);

    const makeFieldMainCursor = useCallback((field: Columns) => {
        setCursorOptions(prev => {
            if(!prev || !Array.isArray(prev.cursor)) return prev; // it is not an array, so we cannot change the order

            const fieldIndex = findCursorIndex(prev.cursor, field);
            if(fieldIndex === -1) return prev; // field is not cursor field

            return { ...prev, cursor: arraySwapByIndex(prev.cursor, fieldIndex, 0) };
        });
    }, []);

    const toggleFieldOrder = useCallback((field: Columns) => {
        setCursorOptions(prev => {
            if(prev && !Array.isArray(prev.cursor) && prev.cursor.field === field) { // cursor is not an array and field equals with cursor field
                const newCursor = { ...prev.cursor };
                newCursor.order = newCursor.order === "asc" ? "desc" : "asc";

                return { ...prev, cursor: newCursor };
            } else if(!prev || !Array.isArray(prev.cursor)) {
                return prev;
            }

            const fieldIndex = findCursorIndex(prev.cursor, field);
            if(fieldIndex === -1) return prev; // field is not cursor field

            const newCursor = [...prev.cursor];
            newCursor[fieldIndex] = {
                ...newCursor[fieldIndex],
                order: newCursor[fieldIndex].order === "asc" ? "desc" : "asc"
            };

            return { ...prev, cursor: newCursor };
        });
    }, []);

    const getOrderIconForField = (field: Columns) => {
        if(!cursorOptions || !Array.isArray(cursorOptions.cursor)) return "help";

        if(!Array.isArray(cursorOptions.cursor)) { // cursor is not an array and field equals with cursor field
            return cursorOptions.cursor === "asc" ? ICON_NAMES.upArrow : ICON_NAMES.downArrow;
        }

        const fieldIndex = findCursorIndex(cursorOptions.cursor, field);
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