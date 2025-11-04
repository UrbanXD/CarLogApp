import { OrderByDirectionExpression, SelectQueryBuilder } from "kysely";
import { sql } from "@powersync/kysely-driver";
import { OrderCondition } from "../AbstractPaginator.ts";

type OrderCondition<FieldName> = {
    field: FieldName
    direction?: OrderByDirectionExpression
    toLowerCase?: boolean
    reverse?: boolean
}

export function addOrder<TableItem = any, DB = any>(
    query: SelectQueryBuilder<DB, TableItem, any>,
    orderCondition: OrderCondition<keyof TableItem>
): SelectQueryBuilder<DB, TableItem, any> {
    let orderDirection = orderCondition?.direction ?? "asc";
    if(orderCondition.reverse) orderDirection = orderDirection === "asc" ? "desc" : "asc";

    let orderByField = orderCondition.field;
    // @formatter:off
    if(orderCondition?.toLowerCase) orderByField = sql`lower(${ sql.ref(orderByField) })`;
    // @formatter:on

    return query.orderBy(orderByField, orderDirection);
}