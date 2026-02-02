import { RangeUnit } from "../../../features/statistics/utils/getRangeUnit.ts";
import { SelectQueryBuilder, sql } from "kysely";
import { ExtractColumnsFromQuery } from "../../hooks/useInfiniteQuery.ts";

export function getRangeExpression<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns extends string = ExtractColumnsFromQuery<QueryBuilder>
>(fieldName: Columns, unit: RangeUnit) {
    //@formatter:off
    switch(unit) {
        case "hour":
            return sql<string>`strftime('%Y-%m-%d %H:00:00', ${ sql.raw(fieldName) })`;
        case "day":
            return sql<string>`strftime('%Y-%m-%d', ${ sql.raw(fieldName) })`;
        case "month":
            return sql<string>`strftime('%Y-%m', ${ sql.raw(fieldName) })`;
        case "year":
            return sql<string>`strftime('%Y', ${ sql.raw(fieldName) })`;
    }
    //@formatter:on
}