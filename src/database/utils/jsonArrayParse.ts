export function jsonArrayParse(row: any, jsonArrayFields: string[] = []): any {
    if(!row || typeof row !== "object") return row;

    const parsedRow = { ...row };

    for(const field of jsonArrayFields) {
        const value = parsedRow[field];

        if(typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                parsedRow[field] = Array.isArray(parsed) ? parsed : [];
            } catch(error) {
                parsedRow[field] = [];
            }
        } else if(value === null || value === undefined) {
            parsedRow[field] = [];
        } else if(Array.isArray(value)) {
            parsedRow[field] = value;
        }
    }

    return parsedRow;
}