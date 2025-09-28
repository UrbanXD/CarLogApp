import { useCallback, useState } from "react";
import { CursorOptions } from "../database/paginator/CursorPaginator.ts";
import { ExpenseTableRow } from "../database/connector/powersync/AppSchema.ts";
import { ICON_NAMES } from "../constants/index.ts";

export function useCursor<TableItem>(options: CursorOptions<keyof TableItem>) {
    const [cursorOptions, setCursorOptions] = useState<CursorOptions<keyof TableItem>>(options);

    // first in cursor options if its an array
    const isMainCursor = useCallback((field: keyof TableItem) => {
        return (
            Array.isArray(cursorOptions.field)
            ? cursorOptions.field[0] === field
            : cursorOptions.field === field
        );
    }, [cursorOptions]);

    const makeFieldMainCursor = useCallback((field: keyof TableItem) => {
        setCursorOptions(prev => {
            if(!Array.isArray(prev.field)) return prev; // it is not an array so we cannot change the order

            const fieldIndex = prev.field.indexOf(field);
            if(fieldIndex === -1) return prev; // field is not cursor field

            const newFields = [...prev.field];
            const newOrders = [...prev.order];

            const [removedField] = newFields.splice(fieldIndex, 1);
            const [removedOrder] = newOrders.splice(fieldIndex, 1);

            return {
                ...prev,
                field: [removedField, ...newFields],
                order: [removedOrder, ...newOrders]
            };
        });
    }, []);

    const toggleFieldOrder = useCallback((field: keyof TableItem) => {
        setCursorOptions(prev => {
            if(!Array.isArray(prev.field) && prev.field === field) { // cursor is not an array and field equals with cursor field
                return { field: prev.field, order: prev.order === "asc" ? "desc" : "asc" };
            } else if(!Array.isArray(prev.field)) {
                return prev;
            }

            const fieldIndex = prev.field.indexOf(field);
            if(fieldIndex === -1) return prev;

            const newOrders = [...prev.order];
            newOrders[fieldIndex] = newOrders[fieldIndex] === "asc" ? "desc" : "asc";

            return { ...prev, order: newOrders };
        });
    }, []);

    const getOrderIconForField = (field: keyof ExpenseTableRow) => {
        if(!Array.isArray(cursorOptions.field) && cursorOptions.field === field) { // cursor is not an array and field equals with cursor field
            return cursorOptions.order === "asc" ? ICON_NAMES.upArrow : ICON_NAMES.downArrow;
        } else if(!Array.isArray(cursorOptions.field)) {
            return "help";
        }

        const idx = cursorOptions.field.indexOf(field);
        if(idx === -1) return "help"; // default
        return cursorOptions.order[idx] === "asc"
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