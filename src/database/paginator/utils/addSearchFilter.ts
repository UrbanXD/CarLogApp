import { SelectQueryBuilder } from "kysely";
import { addFilter } from "./addFilter.ts";

export function addSearchFilter<TableItem = any, DB = any>(
    query: SelectQueryBuilder<DB, TableItem, any>,
    searchTerm?: string
): SelectQueryBuilder<DB, TableItem, any> {
    if(!searchTerm || searchTerm.length === 0) return query;

    return addFilter<TableItem, DB>(
        query,
        {
            field: this.searchBy,
            value: `%${ searchTerm }%`,
            operator: "like",
            toLowerCase: true
        }
    );
}