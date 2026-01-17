import { Kysely, RawBuilder, SelectQueryBuilder, sql } from "kysely";
import { DatabaseType } from "../../connector/powersync/AppSchema.ts";

export function medianSubQuery(
    db: Kysely<DatabaseType>,
    baseQuery: SelectQueryBuilder<DatabaseType, any, any>,
    field: string | RawBuilder<any>
) {
    const countQuery = baseQuery
    .clearSelect()
    .select((sql<number>`COUNT(*)`).as("c"));

    const ordered = baseQuery
    .clearSelect()
    .select((typeof field === "string" ? sql.raw(field) : field).as("val"))
    .orderBy((typeof field === "string" ? sql.raw(field) : field));

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