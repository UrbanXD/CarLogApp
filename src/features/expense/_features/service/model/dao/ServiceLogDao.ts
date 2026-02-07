import { Dao } from "../../../../../../database/dao/Dao.ts";
import {
    DatabaseType,
    ServiceLogTableRow,
    ServiceTypeTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceLog } from "../../schemas/serviceLogSchema.ts";
import { ServiceLogMapper } from "../mapper/ServiceLogMapper.ts";
import { ExpenseDao } from "../../../../model/dao/ExpenseDao.ts";
import {
    OdometerLogDao,
    SelectOdometerTableRow
} from "../../../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { ServiceTypeDao } from "./ServiceTypeDao.ts";
import { SERVICE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/serviceLog.ts";
import { Kysely, sql } from "@powersync/kysely-driver";
import { ServiceLogFormFields } from "../../schemas/form/serviceLogForm.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { SERVICE_ITEM_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItem.ts";
import { OdometerUnitDao } from "../../../../../car/_features/odometer/model/dao/OdometerUnitDao.ts";
import { ExpenseTypeDao } from "../../../../model/dao/ExpenseTypeDao.ts";
import { SelectServiceItemTableRow, ServiceItemDao } from "./ServiceItemDao.ts";
import { CarDao, SelectCarModelTableRow } from "../../../../../car/model/dao/CarDao.ts";
import { SelectExpenseTableRow } from "../../../../model/mapper/expenseMapper.ts";
import { CAR_TABLE } from "../../../../../../database/connector/powersync/tables/car.ts";
import { ODOMETER_UNIT_TABLE } from "../../../../../../database/connector/powersync/tables/odometerUnit.ts";
import { EXPENSE_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/expenseType.ts";
import { CURRENCY_TABLE } from "../../../../../../database/connector/powersync/tables/currency.ts";
import { WithPrefix } from "../../../../../../types";
import { jsonArrayFrom } from "kysely/helpers/sqlite";
import { SERVICE_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/serviceType.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { ServiceItemTotalAmountTableRow } from "../mapper/ServiceItemMapper.ts";
import { SERVICE_ITEM_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItemType.ts";
import { MODEL_TABLE } from "../../../../../../database/connector/powersync/tables/model.ts";
import { MAKE_TABLE } from "../../../../../../database/connector/powersync/tables/make.ts";
import { WatchQueryOptions } from "../../../../../../database/watcher/watcher.ts";
import { UseWatchedQueryItemProps } from "../../../../../../database/hooks/useWatchedQueryItem.ts";
import { ExtractRowFromQuery, UseInfiniteQueryOptions } from "../../../../../../database/hooks/useInfiniteQuery.ts";
import {
    BarChartStatistics,
    DonutChartStatistics,
    Forecast,
    StatisticsFunctionArgs,
    SummaryStatistics
} from "../../../../../../database/dao/types/statistis.ts";
import { ExpenseTypeEnum } from "../../../../model/enums/ExpenseTypeEnum.ts";
import {
    exchangedAmountExpression,
    odometerValueExpression,
    percentExpression,
    pricePerUnitToAmountExpression
} from "../../../../../../database/dao/expressions";
import { StatisticsAggregateQueryResult } from "../../../../../../database/dao/utils/getStatisticsAggregateQuery.ts";
import { formatSummaryStatistics } from "../../../../../../database/dao/utils/formatSummaryStatistics.ts";
import { formatDateToDatabaseFormat } from "../../../../../statistics/utils/formatDateToDatabaseFormat.ts";
import { UseWatchedQueryCollectionProps } from "../../../../../../database/hooks/useWatchedQueryCollection.ts";
import { ServiceItemTypeDao } from "./ServiceItemTypeDao.ts";
import { ServiceTypeEnum } from "../enums/ServiceTypeEnum.ts";
import dayjs from "dayjs";

export type ServiceForecast = {
    [key in ServiceTypeEnum]?: Forecast | null
}

export type StatisticsBetweenServices = {
    averageDistance: number
    averageTime: number
}

export type StatisticsBetweenServicesTableRow = ExtractRowFromQuery<ReturnType<ServiceLogDao["statisticsBetweenServicesQuery"]>>;
export type ServiceFrequencyByOdometerTableRow = ExtractRowFromQuery<ReturnType<ServiceLogDao["frequencyByOdometerQuery"]>>;
export type ServiceTypeComparisonTableRow = ExtractRowFromQuery<ReturnType<ServiceLogDao["typeComparisonQuery"]>>;
export type ServiceItemTypeComparisonTableRow = ExtractRowFromQuery<ReturnType<ServiceLogDao["itemTypeComparisonQuery"]>>;
export type ServiceForecastTableRow = ExtractRowFromQuery<ReturnType<ServiceLogDao["forecastQuery"]>>;

export type SelectServiceLogTableRow =
    Omit<ServiceLogTableRow, "odometer_log_id">
    & WithPrefix<Omit<ServiceTypeTableRow, "id">, "service_type">
    & WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">
    & WithPrefix<Omit<SelectExpenseTableRow, "related_id" | "car_id" | "id" | keyof WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">>, "expense">
    & WithPrefix<Omit<SelectOdometerTableRow, "log_car_id">, "odometer">
    &
    {
        items: Array<SelectServiceItemTableRow>
        totalAmount: Array<ServiceItemTotalAmountTableRow>
    };

export class ServiceLogDao extends Dao<ServiceLogTableRow, ServiceLog, ServiceLogMapper, SelectServiceLogTableRow> {
    private readonly expenseDao: ExpenseDao;
    private readonly odometerLogDao: OdometerLogDao;

    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        expenseDao: ExpenseDao,
        odometerLogDao: OdometerLogDao,
        serviceTypeDao: ServiceTypeDao,
        odometerUnitDao: OdometerUnitDao,
        expenseTypeDao: ExpenseTypeDao,
        serviceItemDao: ServiceItemDao,
        serviceItemTypeDao: ServiceItemTypeDao,
        carDao: CarDao
    ) {
        super(
            db,
            powersync,
            SERVICE_LOG_TABLE,
            new ServiceLogMapper(
                expenseDao,
                odometerLogDao,
                serviceTypeDao,
                odometerUnitDao,
                expenseTypeDao,
                serviceItemDao,
                serviceItemTypeDao,
                carDao
            )
        );

        this.expenseDao = expenseDao;
        this.odometerLogDao = odometerLogDao;
    }

    selectQuery(id?: any | null) {
        return this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as sl` as const)
        .innerJoin(`${ SERVICE_TYPE_TABLE } as st` as const, "st.id", "sl.service_type_id")
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "e.id", "sl.expense_id")
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as et` as const, "et.id", "e.type_id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "c.id", "sl.car_id")
        .innerJoin(`${ MODEL_TABLE } as mo` as const, "mo.id", "c.model_id")
        .innerJoin(`${ MAKE_TABLE } as ma` as const, "ma.id", "mo.make_id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as ol` as const, "ol.id", "sl.odometer_log_id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "ou.id", "c.odometer_unit_id")
        .innerJoin(`${ CURRENCY_TABLE } as cur` as const, "cur.id", "e.currency_id")
        .innerJoin(`${ CURRENCY_TABLE } as ccur` as const, "ccur.id", "c.currency_id")
        .selectAll("sl")
        .select((eb) => [
            "st.key as service_type_key",
            "st.owner_id as service_type_owner_id",
            "e.amount as expense_amount",
            exchangedAmountExpression(eb, "e.amount", "e.exchange_rate").as("expense_exchanged_amount"),
            "e.exchange_rate as expense_exchange_rate",
            "e.date as expense_date",
            "e.note as expense_note",
            "et.id as expense_type_id",
            "et.key as expense_type_key",
            "et.owner_id as expense_type_owner_id",
            "c.name as car_name",
            "mo.id as car_model_id",
            "mo.name as car_model_name",
            "c.model_year as car_model_year",
            "ma.id as car_make_id",
            "ma.name as car_make_name",
            "cur.id as expense_currency_id",
            "cur.symbol as expense_currency_symbol",
            "cur.key as expense_currency_key",
            "ccur.id as expense_car_currency_id",
            "ccur.symbol as expense_car_currency_symbol",
            "ccur.key as expense_car_currency_key",
            "ol.id as odometer_log_id",
            odometerValueExpression(eb, "ol.value", "ou.conversion_factor").as("odometer_log_value"),
            "ol.type_id as odometer_log_type_id",
            "ou.id as odometer_unit_id",
            "ou.key as odometer_unit_key",
            "ou.short as odometer_unit_short",
            "ou.conversion_factor as odometer_unit_conversion_factor",
            jsonArrayFrom(
                eb
                .selectFrom(`${ SERVICE_ITEM_TABLE } as si` as const)
                .innerJoin(`${ SERVICE_ITEM_TYPE_TABLE } as si_sit` as const, "si_sit.id", "si.service_item_type_id")
                .innerJoin(`${ CAR_TABLE } as si_c` as const, "si_c.id", "si.car_id")
                .innerJoin(`${ CURRENCY_TABLE } as si_curr` as const, "si_curr.id", "si.currency_id")
                .innerJoin(`${ CURRENCY_TABLE } as si_ccurr` as const, "si_ccurr.id", "si_c.currency_id")
                .select((eb) => [
                    "si.id",
                    "si.car_id",
                    "si.service_log_id",
                    "si.service_item_type_id",
                    "si.exchange_rate",
                    "si.quantity",
                    "si.price_per_unit",
                    exchangedAmountExpression(
                        eb,
                        "si.price_per_unit",
                        "si.exchange_rate"
                    ).as("exchanged_price_per_unit"),
                    "si_sit.owner_id as type_owner_id",
                    "si_sit.key as type_key",
                    "si_ccurr.id as car_currency_id",
                    "si_ccurr.key as car_currency_key",
                    "si_ccurr.symbol as car_currency_symbol",
                    "si_curr.id as currency_id",
                    "si_curr.key as currency_key",
                    "si_curr.symbol as currency_symbol"
                ])
                .whereRef("si.service_log_id", "=", "sl.id")
            ).as("items"),
            jsonArrayFrom(
                eb.selectFrom(`${ SERVICE_ITEM_TABLE } as si` as const)
                .innerJoin(`${ CURRENCY_TABLE } as si_curr` as const, "si_curr.id", "si.currency_id")
                .innerJoin(`${ CURRENCY_TABLE } as si_ccurr` as const, "si_ccurr.id", "c.currency_id")
                .select((eb) => [
                    pricePerUnitToAmountExpression(
                        eb,
                        "si.price_per_unit",
                        "si.quantity"
                    ).as("amount"),
                    exchangedAmountExpression(
                        eb,
                        pricePerUnitToAmountExpression(
                            eb,
                            "si.price_per_unit",
                            "si.quantity"
                        ),
                        "si.exchange_rate"
                    ).as("exchanged_amount"),
                    "si.exchange_rate as exchange_rate",
                    "si_curr.id as currency_id",
                    "si_curr.key as currency_key",
                    "si_curr.symbol as currency_symbol",
                    "si_ccurr.id as car_currency_id",
                    "si_ccurr.key as car_currency_key",
                    "si_ccurr.symbol as car_currency_symbol"
                ])
                .whereRef("si.service_log_id", "=", "sl.id")
                .groupBy(["si.currency_id", "si.exchange_rate", "si_curr.id", "si_ccurr.id"])
            ).as("totalAmount")
        ])
        .$if(!!id, (qb) => qb.where("sl.id", "=", id!));
    }

    forecastQuery(carId: string) {
        const MAJOR_SERVICE_INTERVAL_ODOMETER = 60000;
        const MAJOR_SERVICE_INTERVAL_TIME = 2 * 365;
        const SMALL_SERVICE_INTERVAL_ODOMETER = 15000;
        const SMALL_SERVICE_INTERVAL_TIME = 365;

        const from = dayjs().subtract(3, "month").toISOString();
        const to = dayjs().toISOString();

        return this.db
        .with("daily_stats", () => this.odometerLogDao.odometerQuery({ carId, from, to })
            .select((eb) => {
                const odometerExpression = odometerValueExpression(eb, "ol.value", "ou.conversion_factor");

                const fromDateExpression = eb.fn<number | null>("JULIANDAY", [eb.val(from)]);
                const toDateExpression = eb.fn<number | null>("JULIANDAY", [eb.val(to)]);
                const dateExpression = eb.fn<number | null>(
                    "NULLIF",
                    [eb.parens(toDateExpression, "-", fromDateExpression), eb.val(0)]
                );

                return [
                    eb.fn.max(odometerExpression).as("current_odometer_value"),
                    eb(
                        eb.parens(
                            eb.fn.max(odometerExpression),
                            "-",
                            eb.fn.min(odometerExpression)
                        ),
                        "/",
                        dateExpression
                    ).$castTo<number | null>().as("avg_daily_distance")
                ];
            })
        )
        .selectFrom(`${ SERVICE_LOG_TABLE } as sl` as const)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as ol` as const, "sl.odometer_log_id", "ol.id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "sl.car_id", "c.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "c.odometer_unit_id", "ou.id")
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "sl.expense_id", "e.id")
        .innerJoin(`${ SERVICE_TYPE_TABLE } as st` as const, "sl.service_type_id", "st.id")
        .innerJoin("daily_stats as ds", (join) => join.onTrue())
        .select((eb) => {
            const odometerExpression = odometerValueExpression(eb, "ol.value", "ou.conversion_factor");
            const isMajorExpression = eb("st.key", "=", eb.val(ServiceTypeEnum.MAJOR_SERVICE));

            const intervalOdometerExpression = eb.case()
            .when(isMajorExpression)
            .then(odometerValueExpression(eb, eb.val(MAJOR_SERVICE_INTERVAL_ODOMETER), "ou.conversion_factor"))
            .else(odometerValueExpression(eb, eb.val(SMALL_SERVICE_INTERVAL_ODOMETER), "ou.conversion_factor"))
            .end();

            const forecastOdometerByIntervalExpression = eb.parens(
                eb.fn.max(odometerExpression),
                "+",
                intervalOdometerExpression
            );

            //ROUND(X / n) * n, n = 1000 for round up to first 1000 52899 -> 53000
            const finalForecastOdometerExpression = eb(
                eb.fn("ROUND", [eb.parens(forecastOdometerByIntervalExpression, "/", eb.val(1000))]),
                "*",
                eb.val(1000)
            ).$castTo<number | null>();

            const intervalTimeExpression = eb.case()
            .when(isMajorExpression)
            .then(eb.val(MAJOR_SERVICE_INTERVAL_TIME))
            .else(eb.val(SMALL_SERVICE_INTERVAL_TIME))
            .end();

            const daysToNextServiceExpression = eb.parens(
                eb.parens(finalForecastOdometerExpression, "-", eb.fn.max(odometerExpression)),
                "/",
                eb.ref("ds.avg_daily_distance")
            );

            //@formatter:off
            const maxForecastDateExpression = sql<string>`DATE(${eb.ref("e.date")}, '+' || ${ intervalTimeExpression } || ' days')`
            const forecastDateByDailyDistanceExpression = sql<string>`DATE('now', '+' || ${ daysToNextServiceExpression } || ' days')`
            //@formatter:on

            const forecastDateExpression = eb.case()
            .when(forecastDateByDailyDistanceExpression, "<", maxForecastDateExpression)
            .then(forecastDateByDailyDistanceExpression)
            .else(maxForecastDateExpression)
            .end();

            const finalForecastDateExpression = eb.case()
            .when(eb("ds.avg_daily_distance", "<=", eb.val(0)))
            .then(eb.val(null))
            .else(
                eb.case()
                .when(eb(finalForecastOdometerExpression, "<=", eb.ref("ds.current_odometer_value")))
                //@formatter:off
                .then(sql<string>`DATE('now')`)
                //@formatter:on
                .else(forecastDateExpression)
                .end()
            )
            .end().$castTo<string | null>();

            return [
                "st.key as type",
                finalForecastOdometerExpression.as("forecast_odometer_value"),
                finalForecastDateExpression.as("forecast_date"),
                eb.fn.max<number | null>(odometerExpression).as("last_odometer_value"),
                "ds.avg_daily_distance"
            ];
        })
        .where("sl.car_id", "=", carId)
        .where("st.key", "in", [ServiceTypeEnum.MAJOR_SERVICE, ServiceTypeEnum.SMALL_SERVICE])
        .groupBy(["st.id", "ds.avg_daily_distance"]);
    }

    summaryStatisticsByAmountQuery(props: StatisticsFunctionArgs) {
        return this.expenseDao.summaryStatisticsQuery<number | null>({
            ...props,
            expenseType: ExpenseTypeEnum.SERVICE,
            onlyRecordValue: true
        });
    }

    statisticsBetweenServicesQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        return this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as sl` as const)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as ol` as const, "sl.odometer_log_id", "ol.id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "sl.car_id", "c.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "c.odometer_unit_id", "ou.id")
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "sl.expense_id", "e.id")
        .select((eb) => {
            const odometerExpression = odometerValueExpression(eb, "ol.value", "ou.conversion_factor");
            const maxOdometerExpression = eb.fn.max(odometerExpression);
            const minOdometerExpression = eb.fn.min(odometerExpression);

            const maxDateExpression = eb.fn<number | null>("JULIANDAY", [eb.fn.max("e.date")]);
            const minDateExpression = eb.fn<number | null>("JULIANDAY", [eb.fn.min("e.date")]);

            const countExpression = eb.fn<number | null>(
                "NULLIF",
                [eb(eb.fn.count("sl.id"), "-", eb.val(1)), eb.val(0)]
            );

            return [
                eb.fn<number | null>("ROUND", [
                    eb(
                        eb.parens(maxOdometerExpression, "-", minOdometerExpression),
                        "/",
                        countExpression
                    )
                ]).as("average_distance"),
                eb(
                    eb.parens(maxDateExpression, "-", minDateExpression),
                    "/",
                    countExpression
                ).as("average_time")
            ];
        })
        .$if(!!carId, (qb) => qb.where("sl.car_id", "=", carId!))
        .where("e.date", ">=", formatDateToDatabaseFormat(from))
        .where("e.date", "<=", formatDateToDatabaseFormat(to));
    }

    frequencyByOdometerQuery({
        carId,
        from,
        to,
        intervalSize = 50000
    }: StatisticsFunctionArgs & { intervalSize?: number }) {
        return this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as sl` as const)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as ol` as const, "sl.odometer_log_id", "ol.id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "sl.car_id", "c.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "c.odometer_unit_id", "ou.id")
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "sl.expense_id", "e.id")
        .select((eb) => [
            eb.fn.count("sl.id").as("service_count"),
            eb(
                eb.cast<number>(
                    eb(
                        odometerValueExpression(eb, "ol.value", "ou.conversion_factor"),
                        "/",
                        eb.val(intervalSize)
                    ),
                    "integer"
                ),
                "*",
                eb.val(intervalSize)
            ).as("interval_start")
        ])
        .$if(!!carId, (qb) => qb.where("sl.car_id", "=", carId!))
        .where("e.date", ">=", formatDateToDatabaseFormat(from))
        .where("e.date", "<=", formatDateToDatabaseFormat(to))
        .groupBy("interval_start")
        .orderBy("interval_start", "asc");
    }

    typeComparisonQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        return this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as sl` as const)
        .innerJoin(`${ SERVICE_TYPE_TABLE } as st` as const, "st.id", "sl.service_type_id")
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "e.id", "sl.expense_id")
        .select((eb) => {
            const amountExpression = exchangedAmountExpression(
                eb,
                "e.amount",
                "e.exchange_rate"
            );

            return [
                eb.fn.sum(amountExpression).as("total"),
                percentExpression(eb, amountExpression).as("percent"),
                "st.id as type_id",
                "st.owner_id",
                "st.key"
            ];
        })
        .$if(!!carId, (qb) => qb.where("e.car_id", "=", carId!))
        .where("e.date", ">=", formatDateToDatabaseFormat(from))
        .where("e.date", "<=", formatDateToDatabaseFormat(to))
        .groupBy("sl.service_type_id")
        .orderBy("total", "desc");
    }

    itemTypeComparisonQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        return this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as sl` as const)
        .innerJoin(`${ SERVICE_ITEM_TABLE } as si` as const, "si.service_log_id", "sl.id")
        .innerJoin(`${ SERVICE_ITEM_TYPE_TABLE } as sit` as const, "sit.id", "si.service_item_type_id")
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "e.id", "sl.expense_id")
        .select((eb) => {
            const amountExpression = exchangedAmountExpression(
                eb,
                pricePerUnitToAmountExpression(eb, "si.price_per_unit", "si.quantity"),
                "si.exchange_rate"
            );

            return [
                eb.fn.sum(amountExpression).as("total"),
                percentExpression(eb, amountExpression).as("percent"),
                "sit.id as type_id",
                "sit.owner_id",
                "sit.key"
            ];
        })
        .$if(!!carId, (qb) => qb.where("e.car_id", "=", carId!))
        .where("e.date", ">=", formatDateToDatabaseFormat(from))
        .where("e.date", "<=", formatDateToDatabaseFormat(to))
        .groupBy("si.service_item_type_id")
        .orderBy("total", "desc");
    }

    serviceLogWatchedQueryItem(
        id: string | null | undefined,
        options?: WatchQueryOptions
    ): UseWatchedQueryItemProps<ServiceLog, SelectServiceLogTableRow> {
        return {
            query: this.selectQuery(id),
            mapper: this.mapper.toDto.bind(this.mapper),
            options: { enabled: !!id, ...options, jsonFields: ["items", "totalAmount"] }
        };
    }

    forecastWatchedQueryCollection(carId: string): UseWatchedQueryCollectionProps<ServiceForecast, ServiceForecastTableRow> {
        return {
            query: this.forecastQuery(carId),
            mapper: this.mapper.toForecast.bind(this.mapper)
        };
    }

    summaryStatisticsByAmountWatchedQueryItem(props: StatisticsFunctionArgs): UseWatchedQueryItemProps<SummaryStatistics, StatisticsAggregateQueryResult<number | null>> {
        return {
            query: this.summaryStatisticsByAmountQuery(props),
            mapper: formatSummaryStatistics
        };
    }

    statisticsBetweenServicesWatchedQueryItem(props: StatisticsFunctionArgs): UseWatchedQueryItemProps<StatisticsBetweenServices, StatisticsBetweenServicesTableRow> {
        return {
            query: this.statisticsBetweenServicesQuery(props),
            mapper: this.mapper.toStatisticsBetweenServices.bind(this.mapper)
        };
    }

    expensesByRangeStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs) {
        return this.expenseDao.groupedExpensesByRangeStatisticsWatchedQueryCollection({
            ...props,
            expenseType: ExpenseTypeEnum.SERVICE
        });
    }

    frequencyByOdometerStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs & {
        intervalSize?: number
    }): UseWatchedQueryCollectionProps<BarChartStatistics, ServiceFrequencyByOdometerTableRow> {
        return {
            query: this.frequencyByOdometerQuery(props),
            mapper: this.mapper.frequencyByOdometerToBarChartStatistics.bind(this.mapper)
        };
    }

    typeComparisonStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs): UseWatchedQueryCollectionProps<DonutChartStatistics, ServiceTypeComparisonTableRow> {
        return {
            query: this.typeComparisonQuery(props),
            mapper: this.mapper.typeComparisonToDonutChartStatistics.bind(this.mapper)
        };
    }

    itemTypeComparisonStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs): UseWatchedQueryCollectionProps<DonutChartStatistics, ServiceItemTypeComparisonTableRow> {
        return {
            query: this.itemTypeComparisonQuery(props),
            mapper: this.mapper.itemTypeComparisonToDonutChartStatistics.bind(this.mapper)
        };
    }


    timelineInfiniteQuery(carId: string): UseInfiniteQueryOptions<ReturnType<ServiceLogDao["selectQuery"]>, ServiceLog> {
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
            mapper: this.mapper.toDto.bind(this.mapper),
            jsonFields: ["items", "totalAmount"]
        };
    }

    async createFromFormResult(formResult: ServiceLogFormFields): Promise<ServiceLogTableRow["id"]> {
        const { serviceLog, serviceItems, expense, odometerLog } = await this.mapper.formResultToEntities(formResult);

        const insertedServiceLogId = await this.db.transaction().execute(async (trx) => {
            await trx
            .insertInto(EXPENSE_TABLE)
            .values(expense)
            .returning("id")
            .executeTakeFirstOrThrow();

            if(odometerLog) {
                await trx
                .insertInto(ODOMETER_LOG_TABLE)
                .values(odometerLog)
                .returning("id")
                .executeTakeFirstOrThrow();
            }

            const result = await trx
            .insertInto(SERVICE_LOG_TABLE)
            .values(serviceLog)
            .returning("id")
            .executeTakeFirstOrThrow();

            const serviceItemsArray = Array.from(serviceItems.values());
            if(serviceItemsArray.length >= 1) {
                await trx
                .insertInto(SERVICE_ITEM_TABLE)
                .values(serviceItemsArray)
                .returning("id")
                .execute();
            }

            return result.id;
        });

        return insertedServiceLogId;
    }

    async updateFromFormResult(formResult: ServiceLogFormFields): Promise<ServiceLogTableRow["id"]> {
        const { serviceLog, serviceItems, expense, odometerLog } = await this.mapper.formResultToEntities(formResult);

        const updatedServiceLogId = await this.db.transaction().execute(async (trx) => {
            await trx
            .updateTable(EXPENSE_TABLE)
            .set(expense)
            .where("id", "=", expense.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            const originalServiceLog = await trx
            .selectFrom(SERVICE_LOG_TABLE)
            .select("odometer_log_id")
            .where("id", "=", serviceLog.id)
            .executeTakeFirst();

            if(originalServiceLog?.odometer_log_id && !odometerLog) {
                await trx
                .deleteFrom(ODOMETER_LOG_TABLE)
                .where("id", "=", originalServiceLog.odometer_log_id)
                .returning("id")
                .executeTakeFirstOrThrow();
            } else if(odometerLog) {
                if(originalServiceLog?.odometer_log_id === odometerLog.id) {
                    await trx
                    .updateTable(ODOMETER_LOG_TABLE)
                    .set(odometerLog)
                    .where("id", "=", odometerLog.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                } else {
                    await trx
                    .insertInto(ODOMETER_LOG_TABLE)
                    .values(odometerLog)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const result = await trx
            .updateTable(SERVICE_LOG_TABLE)
            .set(serviceLog)
            .where("id", "=", serviceLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();


            const originalServiceItems = await trx
            .selectFrom(SERVICE_ITEM_TABLE)
            .select("id")
            .where("service_log_id", "=", serviceLog.id)
            .execute();

            for(const originalServiceItem of originalServiceItems) {
                const newServiceItem = serviceItems.get(originalServiceItem.id);
                if(newServiceItem) { // if service item already exists update
                    await trx
                    .updateTable(SERVICE_ITEM_TABLE)
                    .set(newServiceItem)
                    .where("id", "=", newServiceItem.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    serviceItems.delete(originalServiceItem.id); //remove from new service items
                } else { // if original service item not exists in new service items then remove it
                    await trx
                    .deleteFrom(SERVICE_ITEM_TABLE)
                    .where("id", "=", originalServiceItem.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const serviceItemsArray = Array.from(serviceItems.values());
            if(serviceItemsArray.length >= 1) { // if new elements are left then insert them
                await trx
                .insertInto(SERVICE_ITEM_TABLE)
                .values(serviceItemsArray)
                .returning("id")
                .execute();
            }

            return result.id;
        });

        return updatedServiceLogId;
    }

    async deleteLog(serviceLog: ServiceLog): Promise<string | number> {
        return await this.db.transaction().execute(async (trx) => {
            const result = await trx
            .deleteFrom(SERVICE_LOG_TABLE)
            .where("id", "=", serviceLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .deleteFrom(EXPENSE_TABLE)
            .where("id", "=", serviceLog.expense.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            if(!!serviceLog.odometer) {
                await trx
                .deleteFrom(ODOMETER_LOG_TABLE)
                .where("id", "=", serviceLog.odometer.id)
                .returning("id")
                .executeTakeFirstOrThrow();
            }

            await trx
            .deleteFrom(SERVICE_ITEM_TABLE)
            .where("service_log_id", "=", serviceLog.id)
            .execute();

            return result.id;
        });
    }
}