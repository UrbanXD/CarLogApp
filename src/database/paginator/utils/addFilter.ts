import { SelectQueryBuilder } from "kysely";
import { FilterCondition } from "../AbstractPaginator.ts";
import { sql } from "@powersync/kysely-driver";

export function addFilter<TableItem = any, DB = any>(
    table: string,
    query: SelectQueryBuilder<DB, TableItem, any>,
    filterCondition: FilterCondition<TableItem>
): SelectQueryBuilder<DB, TableItem, any> {
    let filterField = `${ table }.${ filterCondition.field }`;

    // @formatter:off
    if(filterCondition.toLowerCase) filterField = sql`lower(${ sql.ref(filterField) })`;
    // @formatter:on

    let filterValue = filterCondition.value;
    if(filterCondition.toLowerCase && typeof filterValue === "string") {
        filterValue = filterValue.toLowerCase();
    }

    return query.where(filterField, filterCondition.operator, filterValue);
};