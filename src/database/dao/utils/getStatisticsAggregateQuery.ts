import {
    AggregateFunctionBuilder,
    Expression,
    ExpressionBuilder as KyselyExpressionBuilder,
    Kysely,
    RawBuilder,
    SelectQueryBuilder,
    sql
} from "kysely";
import { ExtractColumnsFromQuery, ExtractRowFromQuery } from "../../hooks/useInfiniteQuery.ts";
import { DatabaseType } from "../../connector/powersync/AppSchema.ts";
import { getPreviousRangeWindow } from "../../../features/statistics/utils/getPreviousRangeWindow.ts";
import { formatDateToDatabaseFormat } from "../../../features/statistics/utils/formatDateToDatabaseFormat.ts";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { medianSubQuery } from "./medianSubQuery.ts";
import { ExpressionBuilder } from "../types";

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
}

type GetStatisticsAggregateQueryProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    RecordQueryBuilder extends SelectQueryBuilder<any, any, Record>,
    Record = any
> = {
    db: Kysely<DatabaseType>
    baseQuery: QueryBuilder
    idField: ExtractColumnsFromQuery<QueryBuilder>
    field: ExtractColumnsFromQuery<QueryBuilder> | RawBuilder<any> | ((eb: ExpressionBuilder<QueryBuilder>) => RawBuilder<any> | Expression<any>)
    fromDateField: ExtractColumnsFromQuery<QueryBuilder>
    toDateField?: ExtractColumnsFromQuery<QueryBuilder>
    recordQueryConfig?: {
        query: RecordQueryBuilder
        idField: ExtractColumnsFromQuery<RecordQueryBuilder>
        field: ExtractColumnsFromQuery<RecordQueryBuilder> | RawBuilder<any> | ((eb: ExpressionBuilder<RecordQueryBuilder>) => RawBuilder<any> | Expression<any>)
        fromDateField: ExtractColumnsFromQuery<RecordQueryBuilder>
        toDateField?: ExtractColumnsFromQuery<RecordQueryBuilder>
        jsonObject?: boolean
    } | null
    from?: string | null
    to?: string | null
}

export function getStatisticsAggregateQuery<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    RecordQueryBuilder extends SelectQueryBuilder<any, any, any> = SelectQueryBuilder<any, any, any>,
    Record = ExtractRowFromQuery<RecordQueryBuilder>
>({
    db,
    baseQuery,
    idField,
    field,
    fromDateField,
    toDateField,
    recordQueryConfig,
    from,
    to
}: GetStatisticsAggregateQueryProps<QueryBuilder, RecordQueryBuilder, Record>): SelectQueryBuilder<any, any, StatisticsAggregateQueryResult<Record>> {
    const previousWindow = from && to ? getPreviousRangeWindow(from, to) : null;
    const dbFrom = from ? formatDateToDatabaseFormat(from) : null;
    const dbPreviousWindowFrom = previousWindow ? formatDateToDatabaseFormat(previousWindow.from) : dbFrom;
    const dbTo = to ? formatDateToDatabaseFormat(to) : null;

    function resolveExpression(
        eb: KyselyExpressionBuilder<any, any>,
        field: any
    ): RawBuilder<any> | Expression<any> {
        if(typeof field === "function") return field(eb);
        if(typeof field === "object" && field !== null) return field;
        return sql.ref(field);
    }

    const recordExpression = (
        eb: KyselyExpressionBuilder<any, any>,
        isFromPreviousWindow: boolean,
        isMax: boolean = true
    ): AggregateFunctionBuilder<any, any, Record | null> | RawBuilder<Record | null> | SelectQueryBuilder<any, any, Record | null> => {
        if(recordQueryConfig) {
            const recordFieldExpression = resolveExpression(eb, recordQueryConfig.field);

            const query = recordQueryConfig.query
            .$if(
                !!dbFrom,
                (qb) => qb.where(
                    eb.ref(recordQueryConfig.fromDateField as any),
                    isFromPreviousWindow ? "<" : ">=",
                    dbFrom
                )
            )
            .orderBy(recordFieldExpression, isMax ? "desc" : "asc")
            .limit(1);

            return !!recordQueryConfig.jsonObject ? jsonObjectFrom(query) : query;
        }

        const whenExpression = eb.case()
        .when((eb) => {
            if(dbFrom === null) return eb.val(1);
            return eb(eb.ref(fromDateField as any), isFromPreviousWindow ? "<" : ">=", dbFrom);
        })
        .then(resolveExpression(eb, field))
        .else(null)
        .end();

        const aggregateFn = (isMax ? eb.fn.max : eb.fn.min);

        return aggregateFn(whenExpression).$castTo<Record | null>();
    };

    const query = baseQuery
    .$if(!!dbPreviousWindowFrom, (qb) => qb.where(sql.ref(fromDateField), ">=", dbPreviousWindowFrom))
    .$if(!!dbTo, (qb) => qb.where(sql.ref(toDateField ?? fromDateField), "<=", dbTo));

    return query
    .select((eb) => {
        const fieldExpression = resolveExpression(eb, field);

        return [
            recordExpression(eb, false).as("current_max_record"),
            recordExpression(eb, false, false).as("current_min_record"),
            eb.fn.sum(
                eb.case()
                .when((eb) => {
                    if(dbFrom === null) return eb.val(1);
                    return eb(eb.ref(fromDateField as any), ">=", dbFrom);
                })
                .then(fieldExpression)
                .else(0)
                .end()
            ).as("current_total"),
            eb.fn.avg(
                eb.case()
                .when((eb) => {
                    if(dbFrom === null) return eb.val(1);
                    return eb(eb.ref(fromDateField as any), ">=", dbFrom);
                })
                .then(fieldExpression)
                .else(null)
                .end()
            ).as("current_avg"),
            eb.fn.count(
                eb.case()
                .when((eb) => {
                    if(dbFrom === null) return eb.val(1);
                    return eb(eb.ref(fromDateField as any), ">=", dbFrom);
                })
                .then(eb.ref(idField))
                .else(null)
                .end()
            ).as("current_count"),
            medianSubQuery(
                db,
                query.$if(!!dbFrom, (qb) => qb.where(eb.ref(fromDateField as any), ">=", dbFrom)),
                fieldExpression
            ).as("current_median"),
            //Previous Window
            recordExpression(eb, true).as("previous_max_record"),
            recordExpression(eb, true, false).as("previous_min_record"),
            eb.fn.sum(
                eb.case()
                .when((eb) => {
                    if(dbFrom === null) return eb.val(1);
                    return eb(eb.ref(fromDateField as any), "<", dbFrom);
                })
                .then(fieldExpression)
                .else(0)
                .end()
            ).as("previous_total"),
            eb.fn.avg(
                eb.case()
                .when((eb) => {
                    if(dbFrom === null) return eb.val(1);
                    return eb(eb.ref(fromDateField as any), "<", dbFrom);
                })
                .then(fieldExpression)
                .else(null)
                .end()
            ).as("previous_avg"),
            eb.fn.count(
                eb.case()
                .when((eb) => {
                    if(dbFrom === null) return eb.val(1);
                    return eb(eb.ref(fromDateField as any), "<", dbFrom);
                })
                .then(eb.ref(idField))
                .else(null)
                .end()
            ).as("previous_count"),
            medianSubQuery(
                db,
                query.$if(!!dbFrom, (qb) => qb.where(eb.ref(fromDateField as any), "<", dbFrom)),
                fieldExpression
            ).as("previous_median")
        ];
    });
}
