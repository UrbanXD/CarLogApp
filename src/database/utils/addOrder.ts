import { OrderByDirectionExpression, RawBuilder, SelectQueryBuilder } from "kysely";
import { sql } from "@powersync/kysely-driver";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";

type OrderCondition<FieldName> = {
    field: string
    direction?: OrderByDirectionExpression
    toLowerCase?: boolean
    reverse?: boolean
}

export function addOrder<TableItem>(
    query: SelectQueryBuilder<DatabaseType, any, TableItem>,
    orderCondition: OrderCondition<keyof TableItem>
): SelectQueryBuilder<DatabaseType, any, TableItem> {
    let orderDirection = orderCondition?.direction ?? "asc";
    if(orderCondition.reverse) orderDirection = orderDirection === "asc" ? "desc" : "asc";

    let orderByField: string | RawBuilder<any> = orderCondition.field;
    // @formatter:off
    if(orderCondition?.toLowerCase) orderByField = sql`lower(${ sql.ref(orderByField) })`;
    // @formatter:on

    return query.orderBy(orderByField, orderDirection);
}