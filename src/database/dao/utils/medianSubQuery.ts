import { Kysely, RawBuilder, SelectQueryBuilder, sql } from "kysely";
import { DatabaseType } from "../../connector/powersync/AppSchema.ts";
import { ExtractColumnsFromQuery } from "../../hooks/useInfiniteQuery.ts";

export function medianSubQuery<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>(
    db: Kysely<DatabaseType>,
    baseQuery: QueryBuilder,
    field: Columns | RawBuilder<any>
) {
    const countQuery = baseQuery
    .clearSelect()
    .select((sql<number>`COUNT(*)`).as("c"));
    const expression = typeof field === "object" ? field as RawBuilder<any> : sql.ref(field as string);

    const ordered = baseQuery
    .clearSelect()
    .clearGroupBy()
    .select(expression.as("val"))
    .orderBy(expression);
    //@formatter:off
    const limit = sql<number>`2 - ((${ countQuery }) % 2)`;
    const offset = sql<number>`((${ countQuery }) - 1) / 2`;
    //@formatter:on

    return db
    .selectFrom(
        ordered
        .limit(limit)
        .offset(offset)
        .as("m")
    )
    .select((sql<number>`AVG(m.val)`).as("median"));
}