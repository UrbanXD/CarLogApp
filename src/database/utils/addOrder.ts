import { OrderByDirectionExpression, RawBuilder, SelectQueryBuilder } from "kysely";
import { sql } from "@powersync/kysely-driver";
import { ExtractColumnsFromQuery } from "../hooks/useInfiniteQuery.ts";

type OrderCondition<Columns> = {
    field: Columns
    direction?: OrderByDirectionExpression
    toLowerCase?: boolean
    reverse?: boolean
}

export function addOrder<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>(
    query: QueryBuilder,
    orderCondition: OrderCondition<Columns>
): QueryBuilder {
    let orderDirection = orderCondition?.direction ?? "asc";
    if(orderCondition.reverse) orderDirection = orderDirection === "asc" ? "desc" : "asc";

    let orderByField: Columns | RawBuilder<any> = orderCondition.field;
    // @formatter:off
    if(orderCondition?.toLowerCase) orderByField = sql`lower(${ sql.ref(orderByField as string) })`;
    // @formatter:on

    return query.orderBy(orderByField as string, orderDirection) as QueryBuilder;
}