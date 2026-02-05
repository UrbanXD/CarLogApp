import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Expense } from "../../schemas/expenseSchema.ts";
import { EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/expense.ts";
import { ExpenseTypeDao } from "./ExpenseTypeDao.ts";
import { ExpenseMapper, SelectExpenseTableRow } from "../mapper/expenseMapper.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { ExpenseFormFields } from "../../schemas/form/expenseForm.ts";
import { FUEL_LOG_TABLE } from "../../../../database/connector/powersync/tables/fuelLog.ts";
import { SERVICE_LOG_TABLE } from "../../../../database/connector/powersync/tables/serviceLog.ts";
import { CAR_TABLE } from "../../../../database/connector/powersync/tables/car.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { EXPENSE_TYPE_TABLE } from "../../../../database/connector/powersync/tables/expenseType.ts";
import { CURRENCY_TABLE } from "../../../../database/connector/powersync/tables/currency.ts";
import { WatchQueryOptions } from "../../../../database/watcher/watcher.ts";
import { UseWatchedQueryItemProps } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { MODEL_TABLE } from "../../../../database/connector/powersync/tables/model.ts";
import { MAKE_TABLE } from "../../../../database/connector/powersync/tables/make.ts";
import { UseWatchedQueryCollectionProps } from "../../../../database/hooks/useWatchedQueryCollection.ts";
import { ExtractRowFromQuery, UseInfiniteQueryOptions } from "../../../../database/hooks/useInfiniteQuery.ts";
import { ExpenseTypeEnum } from "../enums/ExpenseTypeEnum.ts";
import {
    getStatisticsAggregateQuery,
    StatisticsAggregateQueryResult
} from "../../../../database/dao/utils/getStatisticsAggregateQuery.ts";
import {
    BarChartStatistics,
    DonutChartStatistics,
    StatisticsFunctionArgs,
    SummaryStatistics
} from "../../../../database/dao/types/statistis.ts";
import { formatSummaryStatistics } from "../../../../database/dao/utils/formatSummaryStatistics.ts";
import { sql } from "kysely";
import { formatDateToDatabaseFormat } from "../../../statistics/utils/formatDateToDatabaseFormat.ts";
import { getRangeUnit } from "../../../statistics/utils/getRangeUnit.ts";
import { getRangeExpression } from "../../../../database/dao/utils/getRangeExpression.ts";
import { exchangedAmountExpression } from "../../../../database/dao/expressions";

export type ExpenseTypeComparisonTableRow = ExtractRowFromQuery<ReturnType<ExpenseDao["typeComparisonQuery"]>>;
export type GroupedExpensesByRangeTableRow = ExtractRowFromQuery<ReturnType<ExpenseDao["groupedExpensesByRangeQuery"]>>;
export type ExpenseRecordTableRow = {
    amount: number | null
    owner_id: string | null
    key: string | null
    type_id: string
}

export class ExpenseDao extends Dao<ExpenseTableRow, Expense, ExpenseMapper, SelectExpenseTableRow> {
    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        expenseTypeDao: ExpenseTypeDao
    ) {
        super(
            db,
            powersync,
            EXPENSE_TABLE,
            new ExpenseMapper(expenseTypeDao)
        );
    }

    selectQuery(id?: any | null) {
        return this.db
        .selectFrom(`${ EXPENSE_TABLE } as e` as const)
        .innerJoin(`${ CAR_TABLE } as c` as const, "c.id", "e.car_id")
        .innerJoin(`${ MODEL_TABLE } as mo` as const, "mo.id", "c.model_id")
        .innerJoin(`${ MAKE_TABLE } as m` as const, "m.id", "mo.make_id")
        .leftJoin(`${ FUEL_LOG_TABLE } as fl` as const, "fl.expense_id", "e.id")
        .leftJoin(`${ SERVICE_LOG_TABLE } as sl` as const, "sl.expense_id", "e.id")
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as et` as const, "et.id", "e.type_id")
        .innerJoin(`${ CURRENCY_TABLE } as c_curr` as const, "c_curr.id", "c.currency_id")
        .innerJoin(`${ CURRENCY_TABLE } as e_curr` as const, "e_curr.id", "e.currency_id")
        .select((eb) => [
            "e.id as id",
            "e.exchange_rate",
            "e.amount",
            exchangedAmountExpression(
                eb,
                "e.amount",
                "e.exchange_rate"
            ).as("exchanged_amount"),
            "e.note",
            "e.date",
            eb.fn.coalesce("fl.id", "sl.id").as("related_id"),
            "c.id as car_id",
            "c.name as car_name",
            "mo.id as car_model_id",
            "mo.name as car_model_name",
            "c.model_year as car_model_year",
            "m.id as car_make_id",
            "m.name as car_make_name",
            "c_curr.id as car_currency_id",
            "c_curr.key as car_currency_key",
            "c_curr.symbol as car_currency_symbol",
            "e_curr.id as currency_id",
            "e_curr.key as currency_key",
            "e_curr.symbol as currency_symbol",
            "et.id as type_id",
            "et.owner_id as type_owner_id",
            "et.key as type_key"
        ])
        .$if(!!id, (qb) => qb.where("e.id", "=", id!));
    }

    summaryStatisticsQuery({
        carId,
        from,
        to,
        expenseType
    }: StatisticsFunctionArgs & { expenseType?: ExpenseTypeEnum }) {
        const applyFilters = (qb: any, tableAlias: string, typeAlias: string) => {
            return qb
            .$if(!!carId, (q: any) => q.where(`${ tableAlias }.car_id`, "=", carId))
            .$if(!!expenseType, (q: any) => q.where(`${ typeAlias }.key`, "=", expenseType));
        };

        let mainQuery = this.db
        .selectFrom(`${ EXPENSE_TABLE } as e` as const)
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as et` as const, "e.type_id", "et.id");

        let subQuery = this.db
        .selectFrom(`${ EXPENSE_TABLE } as ie` as const)
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as iet` as const, "ie.type_id", "iet.id")
        .select((eb) => [
            exchangedAmountExpression(
                eb,
                "ie.amount",
                "ie.exchange_rate"
            ).as("amount"),
            "iet.id as type_id",
            "iet.owner_id",
            "iet.key"
        ]);

        mainQuery = applyFilters(mainQuery, "e", "et");
        subQuery = applyFilters(subQuery, "ie", "iet");

        const query = getStatisticsAggregateQuery<typeof mainQuery, typeof subQuery>({
            db: this.db,
            baseQuery: mainQuery,
            idField: "e.id",
            field: (eb) => exchangedAmountExpression(
                eb,
                "e.amount",
                "e.exchange_rate"
            ),
            fromDateField: "e.date",
            recordQueryConfig: {
                query: subQuery,
                idField: "ie.id",
                field: (eb) => exchangedAmountExpression(
                    eb,
                    "ie.amount",
                    "ie.exchange_rate"
                ),
                fromDateField: "ie.date",
                jsonObject: true
            },
            from: from,
            to: to
        });

        return query;
    }

    typeComparisonQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        return this.db
        .selectFrom(`${ EXPENSE_TABLE } as e` as const)
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as et` as const, "e.type_id", "et.id")
        .select([
            //@formatter:off
            sql<number>`SUM(e.amount)`.as("total"),
            sql<number>`SUM(e.amount) * 100.0 / SUM(SUM(e.amount)) OVER ()`.as("percent"),
            "et.id as type_id",
            "et.owner_id",
            "et.key"
            //@formatter:on
        ])
        .$if(!!carId, (qb) => qb.where("e.car_id", "=", carId!))
        .where("e.date", ">=", formatDateToDatabaseFormat(from))
        .where("e.date", "<=", formatDateToDatabaseFormat(to))
        .groupBy("e.type_id")
        .orderBy("total", "desc");
    }

    groupedExpensesByRangeQuery({
        carId,
        from,
        to,
        expenseType
    }: StatisticsFunctionArgs & { expenseType?: ExpenseTypeEnum }) {
        const rangeUnit = getRangeUnit(from, to);

        const baseQuery = this.db
        .selectFrom(`${ EXPENSE_TABLE } as e` as const)
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as et` as const, "e.type_id", "et.id")
        .select((eb) => [
            eb.fn.sum("e.amount").as("total"),
            "e.type_id"
        ])
        .$if(!!carId, (qb) => qb.where("e.car_id", "=", carId!))
        .$if(!!expenseType, (q: any) => q.where("et.key", "=", expenseType))
        .where("e.date", ">=", formatDateToDatabaseFormat(from))
        .where("e.date", "<=", formatDateToDatabaseFormat(to))
        .groupBy("e.type_id");

        const rangeExpression = getRangeExpression<typeof baseQuery>("e.date", rangeUnit);

        const query = baseQuery
        .select(rangeExpression.as("time"))
        .groupBy(rangeExpression)
        .orderBy(rangeExpression);

        return query;
    }

    expenseWatchedQueryItem(
        id: string | null | undefined,
        options?: WatchQueryOptions<SelectExpenseTableRow>
    ): UseWatchedQueryItemProps<Expense, SelectExpenseTableRow> {
        return {
            query: this.selectQuery(id),
            mapper: this.mapper.toDto.bind(this.mapper),
            options: { enabled: !!id, ...options }
        };
    }

    latestExpenseWatchedQueryCollection(
        carId: string | null | undefined,
        options?: WatchQueryOptions<SelectExpenseTableRow>
    ): UseWatchedQueryCollectionProps<Array<Expense>, SelectExpenseTableRow> {
        const query = this.selectQuery()
        .whereRef("e.car_id", "=", carId as any)
        .orderBy("e.date", "desc")
        .limit(3);

        return {
            query: query,
            mapper: this.mapper.toDtoArray.bind(this.mapper),
            options: { enabled: !!carId, ...options }
        };
    }

    summaryStatisticsWatchedQueryItem(props: StatisticsFunctionArgs & {
        expenseType?: ExpenseTypeEnum
    }): UseWatchedQueryItemProps<SummaryStatistics, StatisticsAggregateQueryResult<ExpenseRecordTableRow>> {
        return {
            query: this.summaryStatisticsQuery(props),
            mapper: (result) => formatSummaryStatistics<ExpenseRecordTableRow>(
                result,
                { recordMapper: this.mapper.toStat.bind(this.mapper) }
            ),
            options: {
                jsonFields: ["current_max_record", "current_min_record", "previous_max_record", "previous_min_record"]
            }
        };
    }

    typeComparisonStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs): UseWatchedQueryCollectionProps<DonutChartStatistics, ExpenseTypeComparisonTableRow> {
        return {
            query: this.typeComparisonQuery(props),
            mapper: this.mapper.typeComparisonToDonutChartStatistics.bind(this.mapper)
        };
    }

    groupedExpensesByRangeStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs & {
        expenseType?: ExpenseTypeEnum
    }): UseWatchedQueryCollectionProps<BarChartStatistics, GroupedExpensesByRangeTableRow> {
        return {
            query: this.groupedExpensesByRangeQuery(props),
            mapper: (entities) => this.mapper.groupedExpensesByRangeToBarChartStatistics(entities, props.expenseType)
        };
    }

    timelineInfiniteQuery(carId: string): UseInfiniteQueryOptions<ReturnType<ExpenseDao["selectQuery"]>, Expense> {
        return {
            baseQuery: this.selectQuery(),
            defaultCursorOptions: {
                cursor: [
                    { field: "e.date", order: "desc" },
                    { field: "e.amount", order: "desc" },
                    { field: "e.id", order: "desc" }
                ],
                defaultOrder: "desc"
            },
            defaultFilters: [
                {
                    key: CAR_TABLE,
                    filters: [{ field: "c.id", operator: "=", value: carId }],
                    logic: "AND"
                }
            ],
            mapper: this.mapper.toDto.bind(this.mapper)
        };
    }

    async createFromFormResult(formResult: ExpenseFormFields) {
        const expenseEntity = this.mapper.formResultToEntity(formResult);
        return await super.create(expenseEntity);
    }

    async updateFromFormResult(formResult: ExpenseFormFields) {
        const expenseEntity = this.mapper.formResultToEntity(formResult);
        return await super.update(expenseEntity);
    }
}