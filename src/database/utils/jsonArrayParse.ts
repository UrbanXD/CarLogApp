import { getFieldName } from "./getFieldName.ts";

export function jsonArrayParse<Row>(row: Row, jsonArrayFields: Array<keyof Row> | undefined): Row {
    if(!row || typeof row !== "object" || !jsonArrayFields || jsonArrayFields.length === 0) return row;

    const parsedRow = { ...row } as Row;

    for(const field of jsonArrayFields) {
        const fieldName = getFieldName<keyof Row>(field as string);
        const value = parsedRow[fieldName];

        if(typeof value === "string") {
            try {
                const parsed = JSON.parse(value) as Row[keyof Row];
                parsedRow[fieldName] = Array.isArray(parsed) ? parsed : [] as any;
            } catch(error) {
                parsedRow[fieldName] = [] as any;
            }
        } else if(value === null || value === undefined) {
            parsedRow[fieldName] = [] as any;
        } else if(Array.isArray(value)) {
            parsedRow[fieldName] = value;
        }
    }

    return parsedRow;
}