import { getFieldName } from "./getFieldName.ts";

export function jsonFieldsParse<Row>(row: Row, jsonFields: Array<keyof Row> | undefined): Row {
    if(!row || typeof row !== "object" || !jsonFields || jsonFields.length === 0) return row;

    const parsedRow = { ...row } as Row;

    for(const field of jsonFields) {
        const fieldName = getFieldName<keyof Row>(field as string);
        const value = parsedRow[fieldName];

        if(typeof value === "string") {
            try {
                parsedRow[field] = JSON.parse(value);
            } catch(error) {
                console.warn(`Failed to parse field: ${ String(field) }`, error);
                parsedRow[field] = null as any;
            }
        }
    }

    return parsedRow;
}