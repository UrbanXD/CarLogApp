import { AggregateFunctionBuilder, ExpressionBuilder, Kysely, RawBuilder, SelectQueryBuilder, sql } from "kysely";
import { ExtractColumnsFromQuery, ExtractRowFromQuery } from "../../hooks/useInfiniteQuery.ts";
import { DatabaseType } from "../../connector/powersync/AppSchema.ts";
import { getPreviousRangeWindow } from "../../../features/statistics/utils/getPreviousRangeWindow.ts";
import { formatDateToDatabaseFormat } from "../../../features/statistics/utils/formatDateToDatabaseFormat.ts";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { medianSubQuery } from "./medianSubQuery.ts";

export type StatisticsAggregateQueryResult<Record = number> = {
    current_max_record: Record | null
    current_min_record: Record | null
    current_total: number | null
    current_avg: number | null
    current_count: number | null
    current_median: number | null
    previous_max_record: Record | null
    previous_min_record: Record | null
    previous_total: number | null
    previous_avg: number | null
    previous_count: number | null
    previous_median: number | null
    unit?: string | null
}

type GetStatisticsAggregateQueryProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MaxItemQuery extends SelectQueryBuilder<any, any, any> = SelectQueryBuilder<any, any, any>,
    Columns extends string = ExtractColumnsFromQuery<QueryBuilder>,
    MaxItemColumns extends string = ExtractColumnsFromQuery<MaxItemQuery>
> = {
    db: Kysely<DatabaseType>
    baseQuery: QueryBuilder
    idField: Columns
    field: Columns | RawBuilder<any>
    fromDateField: Columns
    toDateField?: Columns
    unitField?: Columns
    recordQueryConfig?: {
        query: MaxItemQuery
        idField: MaxItemColumns
        field: MaxItemColumns | RawBuilder<any>
        fromDateField: Columns
        toDateField?: Columns
        jsonObject?: boolean
    }
    from?: string | null
    to?: string | null
}

export function getStatisticsAggregateQuery<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    MaxItemQuery extends SelectQueryBuilder<any, any, any> = SelectQueryBuilder<any, any, any>,
    Record = ExtractRowFromQuery<MaxItemQuery>,
    Columns extends string = ExtractColumnsFromQuery<QueryBuilder>,
    MaxItemColumns extends string = ExtractColumnsFromQuery<MaxItemQuery>
>({
    db,
    baseQuery,
    idField,
    field,
    fromDateField,
    toDateField,
    unitField,
    recordQueryConfig,
    from,
    to
}: GetStatisticsAggregateQueryProps<QueryBuilder, MaxItemQuery, Columns, MaxItemColumns>): SelectQueryBuilder<any, any, StatisticsAggregateQueryResult<Record>> {
    const previousWindow = from && to ? getPreviousRangeWindow(from, to) : null;
    const dbFrom = from ? formatDateToDatabaseFormat(from) : null;
    const dbPreviousWindowFrom = previousWindow ? formatDateToDatabaseFormat(previousWindow.from) : dbFrom;
    const dbTo = to ? formatDateToDatabaseFormat(to) : null;

    const fieldExpression = typeof field === "object" ? field as RawBuilder<any> : sql.ref(field);

    const recordExpression = (
        eb: ExpressionBuilder<any, any>,
        isFromPreviousWindow: boolean,
        isMax: boolean = true
    ): AggregateFunctionBuilder<any, any, Record | null> | RawBuilder<Record | null> | SelectQueryBuilder<any, any, Record | null> => {
        if(recordQueryConfig) {
            const fieldExpression = typeof recordQueryConfig.field === "object"
                                    ? recordQueryConfig.field as RawBuilder<any>
                                    : sql.ref(recordQueryConfig.field);

            const query = recordQueryConfig.query
            .where(eb.ref(recordQueryConfig.fromDateField as any), isFromPreviousWindow ? "<" : ">=", dbFrom)
            .orderBy(fieldExpression, isMax ? "desc" : "asc")
            .limit(1);

            return !!recordQueryConfig.jsonObject ? jsonObjectFrom(query) : query;
        }

        const whenExpression = eb.case()
        .when(eb.ref(fromDateField as any), isFromPreviousWindow ? "<" : ">=", dbFrom)
        .then(fieldExpression)
        .else(isMax ? 0 : Number.MAX_SAFE_INTEGER)
        .end();

        const aggregateFn = (isMax ? eb.fn.max : eb.fn.min);

        return aggregateFn(whenExpression).$castTo<Record | null>();
    };

    const query = baseQuery
    .$if(!!dbPreviousWindowFrom, (qb) => qb.where(sql.ref(fromDateField), ">=", dbPreviousWindowFrom))
    .$if(!!dbTo, (qb) => qb.where(sql.ref(toDateField ?? fromDateField), "<=", dbTo));

    return query
    .$if(!!unitField, (q) => q.select(sql.ref(unitField!).as("unit")))
    .select((eb) => [
        recordExpression(eb, false).as("current_max_record"),
        recordExpression(eb, false, false).as("current_min_record"),
        eb.fn.sum(
            eb.case()
            .when(eb.ref(fromDateField as any), ">=", dbFrom)
            .then(fieldExpression)
            .else(0)
            .end()
        ).as("current_total"),
        eb.fn.avg(
            eb.case()
            .when(eb.ref(fromDateField as any), ">=", dbFrom)
            .then(fieldExpression)
            .else(null)
            .end()
        ).as("current_avg"),
        eb.fn.count(
            eb.case()
            .when(eb.ref(fromDateField as any), ">=", dbFrom)
            .then(eb.ref(idField))
            .else(null)
            .end()
        ).as("current_count"),
        medianSubQuery(
            db,
            query.where(eb.ref(fromDateField as any), ">=", dbFrom),
            fieldExpression
        ).as("current_median"),
        //Previous Window
        recordExpression(eb, true).as("previous_max_item"),
        recordExpression(eb, true, false).as("previous_min_item"),
        eb.fn.sum(
            eb.case()
            .when(eb.ref(fromDateField as any), "<", dbFrom)
            .then(fieldExpression)
            .else(0)
            .end()
        ).as("previous_total"),
        eb.fn.avg(
            eb.case()
            .when(eb.ref(fromDateField as any), "<", dbFrom)
            .then(fieldExpression)
            .else(null)
            .end()
        ).as("previous_avg"),
        eb.fn.count(
            eb.case()
            .when(eb.ref(fromDateField as any), "<", dbFrom)
            .then(eb.ref(idField))
            .else(null)
            .end()
        ).as("previous_count"),
        medianSubQuery(
            db,
            query.where(eb.ref(fromDateField as any), "<", dbFrom),
            fieldExpression
        ).as("previous_median")
    ]);
}
