import { Dao } from "../../../../database/dao/Dao.ts";
import {
    CurrencyTableRow,
    DatabaseType,
    OdometerUnitTableRow,
    RideLogTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { RideLog } from "../../schemas/rideLogSchema.ts";
import { RideLogMapper } from "../mapper/rideLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { OdometerLogDao, SelectOdometerTableRow } from "../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { OdometerUnitDao } from "../../../car/_features/odometer/model/dao/OdometerUnitDao.ts";
import { CarDao, SelectCarModelTableRow } from "../../../car/model/dao/CarDao.ts";
import { RIDE_LOG_TABLE } from "../../../../database/connector/powersync/tables/rideLog.ts";
import { RideLogFormFields } from "../../schemas/form/rideLogForm.ts";
import { ODOMETER_LOG_TABLE } from "../../../../database/connector/powersync/tables/odometerLog.ts";
import { RIDE_EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/rideExpense.ts";
import { RIDE_PLACE_TABLE } from "../../../../database/connector/powersync/tables/ridePlace.ts";
import { RIDE_PASSENGER_TABLE } from "../../../../database/connector/powersync/tables/ridePassenger.ts";
import { EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/expense.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { RidePlaceMapper, SelectRidePlaceTableRow } from "../../_features/place/model/mapper/ridePlaceMapper.ts";
import {
    RidePassengerMapper,
    SelectRidePassengerTableRow
} from "../../_features/passenger/model/mapper/ridePassengerMapper.ts";
import { WithPrefix } from "../../../../types";
import { CAR_TABLE } from "../../../../database/connector/powersync/tables/car.ts";
import { ODOMETER_UNIT_TABLE } from "../../../../database/connector/powersync/tables/odometerUnit.ts";
import { CURRENCY_TABLE } from "../../../../database/connector/powersync/tables/currency.ts";
import { jsonArrayFrom } from "kysely/helpers/sqlite";
import {
    RideExpenseMapper,
    SelectRideExpenseTableRow
} from "../../_features/rideExpense/model/mapper/rideExpenseMapper.ts";
import { PASSENGER_TABLE } from "../../../../database/connector/powersync/tables/passenger.ts";
import { EXPENSE_TYPE_TABLE } from "../../../../database/connector/powersync/tables/expenseType.ts";
import { WatchQueryOptions } from "../../../../database/watcher/watcher.ts";
import { UseWatchedQueryItemProps } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { MODEL_TABLE } from "../../../../database/connector/powersync/tables/model.ts";
import { MAKE_TABLE } from "../../../../database/connector/powersync/tables/make.ts";
import { UseWatchedQueryCollectionProps } from "../../../../database/hooks/useWatchedQueryCollection.ts";
import { formatDateToDatabaseFormat } from "../../../statistics/utils/formatDateToDatabaseFormat.ts";
import { DateType } from "react-native-ui-datepicker";
import { ExtractRowFromQuery, UseInfiniteQueryOptions } from "../../../../database/hooks/useInfiniteQuery.ts";
import {
    exchangedAmountExpression,
    julianDayExpression,
    odometerValueExpression,
    rangeExpression
} from "../../../../database/dao/expressions";
import {
    BarChartStatistics,
    LineChartStatistics,
    StatisticsFunctionArgs,
    SummaryStatistics,
    TopListStatistics
} from "../../../../database/dao/types/statistics.ts";
import {
    getStatisticsAggregateQuery,
    StatisticsAggregateQueryResult
} from "../../../../database/dao/utils/getStatisticsAggregateQuery.ts";
import { formatSummaryStatistics } from "../../../../database/dao/utils/formatSummaryStatistics.ts";
import { PLACE_TABLE } from "../../../../database/connector/powersync/tables/place.ts";
import { getRangeUnit } from "../../../statistics/utils/getRangeUnit.ts";

export type SelectBaseRideLogTableRow = RideLogTableRow
    & WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">
    & WithPrefix<CurrencyTableRow, "car_currency">
    & WithPrefix<Omit<SelectOdometerTableRow, "log_car_id" | keyof WithPrefix<OdometerUnitTableRow, "unit">>, "start_odometer">
    & WithPrefix<Omit<SelectOdometerTableRow, "log_car_id" | keyof WithPrefix<OdometerUnitTableRow, "unit">>, "end_odometer">
    & WithPrefix<OdometerUnitTableRow, "odometer_unit">

export type SelectRideLogTableRow =
    SelectBaseRideLogTableRow
    & {
    expenses: Array<SelectRideExpenseTableRow>
    places: Array<SelectRidePlaceTableRow>
    passengers: Array<SelectRidePassengerTableRow>
}

export type SelectTimelineRideLogTableRow =
    SelectBaseRideLogTableRow
    & {
    distance: number
    total_expense: number
    duration: number
}

export type RideMostVisitedPlacesTableRow = ExtractRowFromQuery<ReturnType<RideLogDao["mostVisitedPlacesQuery"]>>;
export type RideFrequencyTableRow = ExtractRowFromQuery<ReturnType<RideLogDao["frequencyQuery"]>>;
export type DrivingActivityTableRow = ExtractRowFromQuery<ReturnType<RideLogDao["drivingActivityQuery"]>>;

export class RideLogDao extends Dao<RideLogTableRow, RideLog, RideLogMapper, SelectRideLogTableRow> {
    readonly rideExpenseMapper: RideExpenseMapper;
    readonly ridePlaceMapper: RidePlaceMapper;
    readonly ridePassengerMapper: RidePassengerMapper;

    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        rideExpenseMapper: RideExpenseMapper,
        ridePlaceMapper: RidePlaceMapper,
        ridePassengerMapper: RidePassengerMapper,
        odometerLogDao: OdometerLogDao,
        odometerUnitDao: OdometerUnitDao,
        carDao: CarDao
    ) {
        super(
            db,
            powersync,
            RIDE_LOG_TABLE,
            new RideLogMapper(
                rideExpenseMapper,
                ridePlaceMapper,
                ridePassengerMapper,
                odometerLogDao,
                odometerUnitDao,
                carDao
            )
        );

        this.rideExpenseMapper = rideExpenseMapper;
        this.ridePlaceMapper = ridePlaceMapper;
        this.ridePassengerMapper = ridePassengerMapper;
    }

    baseQuery() {
        return this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as rl` as const)
        .innerJoin(`${ CAR_TABLE } as c` as const, "c.id", "rl.car_id")
        .innerJoin(`${ MODEL_TABLE } as mo` as const, "mo.id", "c.model_id")
        .innerJoin(`${ MAKE_TABLE } as ma` as const, "ma.id", "mo.make_id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "ou.id", "c.odometer_unit_id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as sol` as const, "sol.id", "rl.start_odometer_log_id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as eol` as const, "eol.id", "rl.end_odometer_log_id")
        .innerJoin(`${ CURRENCY_TABLE } as ccur` as const, "ccur.id", "c.currency_id")
        .select((eb) => [
            "rl.id",
            "rl.start_time",
            "rl.end_time",
            "rl.note",
            "c.id as car_id",
            "c.name as car_name",
            "mo.id as car_model_id",
            "mo.name as car_model_name",
            "c.model_year as car_model_year",
            "ma.id as car_make_id",
            "ma.name as car_make_name",
            "ccur.id as car_currency_id",
            "ccur.key as car_currency_key",
            "ccur.symbol as car_currency_symbol",
            "sol.id as start_odometer_log_id",
            odometerValueExpression(eb, "sol.value", "ou.conversion_factor").as("start_odometer_log_value"),
            "eol.id as end_odometer_log_id",
            odometerValueExpression(eb, "eol.value", "ou.conversion_factor").as("end_odometer_log_value"),
            "ou.id as odometer_unit_id",
            "ou.key as odometer_unit_key",
            "ou.short as odometer_unit_short",
            "ou.conversion_factor as odometer_unit_conversion_factor"
        ]);
    }

    selectQuery(id?: any | null) {
        return this.baseQuery()
        .select((eb) => [
            jsonArrayFrom(
                eb
                .selectFrom(`${ RIDE_EXPENSE_TABLE } as re` as const)
                .innerJoin(`${ EXPENSE_TABLE } as e` as const, "e.id", "re.expense_id")
                .innerJoin(`${ CAR_TABLE } as c` as const, "c.id", "e.car_id")
                .innerJoin(`${ MODEL_TABLE } as mo` as const, "mo.id", "c.model_id")
                .innerJoin(`${ MAKE_TABLE } as ma` as const, "ma.id", "mo.make_id")
                .innerJoin(`${ EXPENSE_TYPE_TABLE } as et` as const, "et.id", "e.type_id")
                .innerJoin(`${ CURRENCY_TABLE } as cur` as const, "cur.id", "e.currency_id")
                .innerJoin(`${ CURRENCY_TABLE } as ccur` as const, "ccur.id", "c.currency_id")
                .select((eb) => [
                    "re.id",
                    "re.owner_id",
                    "re.ride_log_id",
                    "e.id as expense_id",
                    "e.car_id as expense_car_id",
                    "c.name as expense_car_name",
                    "mo.id as expense_car_model_id",
                    "mo.name as expense_car_model_name",
                    "c.model_year as expense_car_model_year",
                    "ma.id as expense_car_make_id",
                    "ma.name as expense_car_make_name",
                    "e.amount as expense_amount",
                    exchangedAmountExpression(eb, "e.amount", "e.exchange_rate").as("expense_exchanged_amount"),
                    "e.exchange_rate as expense_exchange_rate",
                    "e.date as expense_date",
                    "e.note as expense_note",
                    "et.id as expense_type_id",
                    "et.key as expense_type_key",
                    "et.owner_id as expense_type_owner_id",
                    "cur.id as expense_currency_id",
                    "cur.symbol as expense_currency_symbol",
                    "cur.key as expense_currency_key",
                    "ccur.id as expense_car_currency_id",
                    "ccur.symbol as expense_car_currency_symbol",
                    "ccur.key as expense_car_currency_key"
                ])
                .whereRef("re.ride_log_id", "=", "rl.id")
            ).as("expenses"),
            jsonArrayFrom(
                eb
                .selectFrom(`${ RIDE_PASSENGER_TABLE } as rp` as const)
                .innerJoin(`${ PASSENGER_TABLE } as p` as const, "p.id", "rp.passenger_id")
                .select([
                    "rp.id",
                    "rp.owner_id",
                    "rp.ride_log_id",
                    "p.id as passenger_id",
                    "rp.passenger_order",
                    "p.name"
                ])
                .whereRef("rp.ride_log_id", "=", "rl.id")
                .orderBy("rp.passenger_order", "asc")
            ).as("passengers"),
            jsonArrayFrom(
                eb
                .selectFrom(`${ RIDE_PLACE_TABLE } as rp` as const)
                .innerJoin(`${ PASSENGER_TABLE } as p` as const, "p.id", "rp.place_id")
                .select([
                    "rp.id",
                    "rp.owner_id",
                    "rp.ride_log_id",
                    "p.id as place_id",
                    "rp.place_order",
                    "p.name"
                ])
                .whereRef("rp.ride_log_id", "=", "rl.id")
                .orderBy("rp.place_order", "asc")
            ).as("places")
        ])
        .$if(!!id, (qb) => qb.where("rl.id", "=", id!));
    }

    summaryStatisticsBaseQuery(carId?: string | null) {
        return this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as rl` as const)
        .$if(!!carId, (qb) => qb.where("rl.car_id", "=", carId!));
    }

    summaryStatisticsByDistanceQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        const baseQuery = this.summaryStatisticsBaseQuery(carId)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as s_ol` as const, "rl.start_odometer_log_id", "s_ol.id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as e_ol` as const, "rl.end_odometer_log_id", "e_ol.id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "rl.car_id", "c.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "c.odometer_unit_id", "ou.id");

        return getStatisticsAggregateQuery<typeof baseQuery>({
            db: this.db,
            baseQuery,
            idField: "rl.id",
            field: (eb) => {
                const startOdometerExpression = odometerValueExpression(eb, "s_ol.value", "ou.conversion_factor");
                const endOdometerExpression = odometerValueExpression(eb, "e_ol.value", "ou.conversion_factor");

                return eb(endOdometerExpression, "-", startOdometerExpression);
            },
            fromDateField: "rl.start_time",
            toDateField: "rl.end_time",
            from: from,
            to: to
        });
    }

    summaryStatisticsByDurationQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        return getStatisticsAggregateQuery({
            db: this.db,
            baseQuery: this.summaryStatisticsBaseQuery(carId),
            idField: "rl.id",
            field: (eb) => eb(julianDayExpression(eb, "rl.end_time"), "-", julianDayExpression(eb, "rl.start_time")),
            fromDateField: "rl.start_time",
            toDateField: "rl.end_time",
            from: from,
            to: to
        });
    }

    mostVisitedPlacesQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        return this.db
        .selectFrom(`${ RIDE_PLACE_TABLE } as rp` as const)
        .innerJoin(`${ RIDE_LOG_TABLE } as rl` as const, "rp.ride_log_id", "rl.id")
        .innerJoin(`${ PLACE_TABLE } as p` as const, "rp.place_id", "p.id")
        .select((eb) => [
            "p.name",
            eb.fn.count("rp.id").as("count")
        ])
        .$if(!!carId, (qb) => qb.where("rl.car_id", "=", carId!))
        .where("rl.start_time", ">=", formatDateToDatabaseFormat(from))
        .where("rl.end_time", "<=", formatDateToDatabaseFormat(to))
        .groupBy("p.id")
        .orderBy("count", "desc")
        .limit(3);
    }

    frequencyQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        const rangeUnit = getRangeUnit(from, to);

        return this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as rl` as const)
        .select((eb) => [
            eb.fn.count<number>("rl.id").as("count"),
            rangeExpression(eb, "rl.start_time", rangeUnit).as("time")
        ])
        .$if(!!carId, (qb) => qb.where("rl.car_id", "=", carId!))
        .where("rl.start_time", ">=", formatDateToDatabaseFormat(from))
        .where("rl.start_time", "<=", formatDateToDatabaseFormat(to))
        .groupBy((eb) => rangeExpression(eb, "rl.start_time", rangeUnit))
        .orderBy((eb) => rangeExpression(eb, "rl.start_time", rangeUnit));
    }

    drivingActivityQuery({
        carId,
        from,
        to
    }: StatisticsFunctionArgs) {
        const rangeUnit = getRangeUnit(from, to);

        return this.db
        .selectFrom(`${ RIDE_LOG_TABLE } as rl` as const)
        .innerJoin(`${ ODOMETER_LOG_TABLE } as s_ol` as const, "rl.start_odometer_log_id", "s_ol.id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as e_ol` as const, "rl.end_odometer_log_id", "e_ol.id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "rl.car_id", "c.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "c.odometer_unit_id", "ou.id")
        .select((eb) => {
            const startOdometerExpression = odometerValueExpression(eb, "s_ol.value", "ou.conversion_factor");
            const endOdometerExpression = odometerValueExpression(eb, "e_ol.value", "ou.conversion_factor");

            return [
                eb.fn.sum<number | null>(eb(endOdometerExpression, "-", startOdometerExpression)).as("activity"),
                rangeExpression(eb, "rl.start_time", rangeUnit).as("time")
            ];
        })
        .$if(!!carId, (qb) => qb.where("rl.car_id", "=", carId!))
        .where("rl.start_time", ">=", formatDateToDatabaseFormat(from))
        .where("rl.start_time", "<=", formatDateToDatabaseFormat(to))
        .groupBy((eb) => rangeExpression(eb, "rl.start_time", rangeUnit))
        .orderBy((eb) => rangeExpression(eb, "rl.start_time", rangeUnit));
    }

    selectTimelineQuery() {
        return this.baseQuery()
        .select((eb) => [
            eb
            .selectFrom(`${ RIDE_EXPENSE_TABLE } as re` as const)
            .innerJoin(`${ EXPENSE_TABLE } as e` as const, "e.id", "re.expense_id")
            .whereRef("re.ride_log_id", "=", "rl.id")
            .select(
                (eb) => eb.fn.coalesce(
                    eb.fn.sum(exchangedAmountExpression(eb, "e.amount", "e.exchange_rate")),
                    eb.val(0)
                ).as("total")
            ).as("total_expense"),
            eb.fn.coalesce(
                eb(
                    odometerValueExpression(eb, "sol.value", "ou.conversion_factor"),
                    "-",
                    odometerValueExpression(eb, "eol.value", "ou.conversion_factor")
                ),
                eb.val(0)
            ).as("distance"),
            eb(
                eb(
                    eb.fn("JULIANDAY", [eb.ref("rl.end_time")]),
                    "-",
                    eb.fn("JULIANDAY", [eb.ref("rl.start_time")])
                ),
                "*",
                eb.val(86400)
            ).as("duration")
        ])
        .$castTo<SelectTimelineRideLogTableRow>();
    }

    rideLogWatchedQueryItem(
        id: string | null | undefined,
        options?: WatchQueryOptions
    ): UseWatchedQueryItemProps<RideLog, SelectRideLogTableRow> {
        return {
            query: this.selectQuery(id),
            mapper: this.mapper.toDto.bind(this.mapper),
            options: { enabled: !!id, ...options, jsonFields: ["expenses", "passengers", "places"] }
        };
    }

    summaryStatisticsByDistanceWatchedQueryItem(props: StatisticsFunctionArgs): UseWatchedQueryItemProps<SummaryStatistics, StatisticsAggregateQueryResult> {
        return {
            query: this.summaryStatisticsByDistanceQuery(props),
            mapper: formatSummaryStatistics
        };
    }

    summaryStatisticsByDurationWatchedQueryItem(props: StatisticsFunctionArgs): UseWatchedQueryItemProps<SummaryStatistics, StatisticsAggregateQueryResult> {
        return {
            query: this.summaryStatisticsByDurationQuery(props),
            mapper: formatSummaryStatistics
        };
    }

    mostVisitedPlacesStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs): UseWatchedQueryCollectionProps<TopListStatistics, RideMostVisitedPlacesTableRow> {
        return {
            query: this.mostVisitedPlacesQuery(props),
            mapper: this.mapper.mostVisitedPlacesToTopListStatistics.bind(this.mapper)
        };
    }

    frequencyStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs): UseWatchedQueryCollectionProps<BarChartStatistics, RideFrequencyTableRow> {
        return {
            query: this.frequencyQuery(props),
            mapper: this.mapper.frequencyToBarChartStatistics.bind(this.mapper)
        };
    }

    drivingActivityStatisticsWatchedQueryCollection(props: StatisticsFunctionArgs): UseWatchedQueryCollectionProps<LineChartStatistics, DrivingActivityTableRow> {
        return {
            query: this.drivingActivityQuery(props),
            mapper: this.mapper.drivingActivityToLineChartStatistics.bind(this.mapper)
        };
    }

    upcomingRideWatchedQueryCollection(
        carId: string | null | undefined,
        startTime: DateType,
        options?: WatchQueryOptions
    ): UseWatchedQueryCollectionProps<Array<RideLog>, SelectRideLogTableRow> {
        const query = this.selectQuery()
        .whereRef("rl.car_id", "=", carId as any)
        .where("rl.start_time", ">=", formatDateToDatabaseFormat(startTime) as any)
        .orderBy("rl.start_time", "asc")
        .limit(3);

        return {
            query: query,
            mapper: this.mapper.toDtoArray.bind(this.mapper),
            options: { enabled: !!carId, ...options, jsonFields: ["expenses", "passengers", "places"] }
        };
    }

    timelineInfiniteQuery(carId: string): UseInfiniteQueryOptions<ReturnType<RideLogDao["selectTimelineQuery"]>, RideLog> {
        return {
            baseQuery: this.selectTimelineQuery(),
            defaultCursorOptions: {
                cursor: [
                    { field: "rl.start_time", order: "desc" },
                    { field: "rl.end_time", order: "desc" },
                    { field: "distance", order: "desc" },
                    { field: "duration", order: "desc" },
                    { field: "total_expense", order: "desc" },
                    { field: "rl.id", order: "desc" }
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
            mapper: this.mapper.timelineEntityToDto.bind(this.mapper)
        };
    }

    async createFromFormResult(formResult: RideLogFormFields): Promise<RideLogTableRow["id"]> {
        const {
            rideLog,
            expenses,
            rideExpenses,
            ridePlaces,
            ridePassengers,
            startOdometerLog,
            endOdometerLog
        } = await this.mapper.formResultToEntities(formResult);

        const insertedRideLogId = await this.db.transaction().execute(async (trx) => {
            await trx
            .insertInto(ODOMETER_LOG_TABLE)
            .values(startOdometerLog as any)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .insertInto(ODOMETER_LOG_TABLE)
            .values(endOdometerLog as any)
            .returning("id")
            .executeTakeFirstOrThrow();

            const result = await trx
            .insertInto(RIDE_LOG_TABLE)
            .values(rideLog as any)
            .returning("id")
            .executeTakeFirstOrThrow();

            const expenseArray = Array.from(expenses.values());
            if(expenseArray.length >= 1) {
                await trx
                .insertInto(EXPENSE_TABLE)
                .values(expenseArray as any)
                .returning("id")
                .execute();
            }

            const rideExpenseArray = Array.from(rideExpenses.values());
            if(rideExpenseArray.length >= 1) {
                await trx
                .insertInto(RIDE_EXPENSE_TABLE)
                .values(rideExpenseArray as any)
                .returning("id")
                .execute();
            }

            const ridePlaceArray = Array.from(ridePlaces.values());
            if(ridePlaceArray.length >= 1) {
                await trx
                .insertInto(RIDE_PLACE_TABLE)
                .values(ridePlaceArray as any)
                .returning("id")
                .execute();
            }

            const ridePassengerArray = Array.from(ridePassengers.values());
            if(ridePassengerArray.length >= 1) {
                await trx
                .insertInto(RIDE_PASSENGER_TABLE)
                .values(ridePassengerArray as any)
                .returning("id")
                .execute();
            }

            return result.id;
        });

        return insertedRideLogId;
    }

    async updateFromFormResult(formResult: RideLogFormFields): Promise<RideLogTableRow["id"]> {
        const {
            rideLog,
            expenses,
            rideExpenses,
            ridePlaces,
            ridePassengers,
            startOdometerLog,
            endOdometerLog
        } = await this.mapper.formResultToEntities(formResult);

        const updatedRideLogId = await this.db.transaction().execute(async (trx) => {
            await trx
            .updateTable(ODOMETER_LOG_TABLE)
            .set(startOdometerLog as any)
            .where("id", "=", startOdometerLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .updateTable(ODOMETER_LOG_TABLE)
            .set(endOdometerLog as any)
            .where("id", "=", endOdometerLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            const result = await trx
            .updateTable(RIDE_LOG_TABLE)
            .set(rideLog as any)
            .where("id", "=", rideLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            const originalRideExpenses = await trx
            .selectFrom(RIDE_EXPENSE_TABLE)
            .select(["id", "expense_id"])
            .where("ride_log_id", "=", rideLog.id)
            .execute();

            for(const originalRideExpense of originalRideExpenses) {
                if(!originalRideExpense.expense_id) continue;

                const newExpense = expenses.get(originalRideExpense.expense_id);
                if(newExpense) {
                    await trx
                    .updateTable(EXPENSE_TABLE)
                    .set(newExpense as any)
                    .where("id", "=", newExpense.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    expenses.delete(newExpense.id);
                } else {
                    await trx
                    .deleteFrom(EXPENSE_TABLE)
                    .where("id", "=", originalRideExpense.expense_id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }

                const newRideExpense = rideExpenses.get(originalRideExpense.id);
                if(newRideExpense) {
                    await trx
                    .updateTable(RIDE_EXPENSE_TABLE)
                    .set(newRideExpense as any)
                    .where("id", "=", newRideExpense.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    rideExpenses.delete(newRideExpense.id);
                } else {
                    await trx
                    .deleteFrom(RIDE_EXPENSE_TABLE)
                    .where("id", "=", originalRideExpense.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const expenseArray = Array.from(expenses.values());
            if(expenseArray.length >= 1) {
                await trx
                .insertInto(EXPENSE_TABLE)
                .values(expenseArray as any)
                .returning("id")
                .execute();
            }

            const rideExpenseArray = Array.from(rideExpenses.values());
            if(rideExpenseArray.length >= 1) {
                await trx
                .insertInto(RIDE_EXPENSE_TABLE)
                .values(rideExpenseArray as any)
                .returning("id")
                .execute();
            }

            const originalRidePlaces = await trx
            .selectFrom(RIDE_PLACE_TABLE)
            .select("id")
            .where("ride_log_id", "=", rideLog.id)
            .execute();

            for(const originalRidePlace of originalRidePlaces) {
                const newRidePlace = ridePlaces.get(originalRidePlace.id);

                if(newRidePlace) {
                    await trx
                    .updateTable(RIDE_PLACE_TABLE)
                    .set(newRidePlace)
                    .where("id", "=", newRidePlace.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    ridePlaces.delete(newRidePlace.id);
                } else {
                    await trx
                    .deleteFrom(RIDE_PLACE_TABLE)
                    .where("id", "=", originalRidePlace.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const ridePlaceArray = Array.from(ridePlaces.values());
            if(ridePlaceArray.length >= 1) {
                await trx
                .insertInto(RIDE_PLACE_TABLE)
                .values(ridePlaceArray as any)
                .returning("id")
                .execute();
            }

            const originalRidePassengers = await trx
            .selectFrom(RIDE_PASSENGER_TABLE)
            .select("id")
            .where("ride_log_id", "=", rideLog.id)
            .execute();

            for(const originalRidePassenger of originalRidePassengers) {
                const newRidePassenger = ridePassengers.get(originalRidePassenger.id);
                if(newRidePassenger) {
                    await trx
                    .updateTable(RIDE_PASSENGER_TABLE)
                    .set(newRidePassenger)
                    .where("id", "=", newRidePassenger.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    ridePassengers.delete(newRidePassenger.id);
                } else {
                    await trx
                    .deleteFrom(RIDE_PASSENGER_TABLE)
                    .where("id", "=", originalRidePassenger.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const ridePassengerArray = Array.from(ridePassengers.values());
            if(ridePassengerArray.length >= 1) {
                await trx
                .insertInto(RIDE_PASSENGER_TABLE)
                .values(ridePassengerArray as any)
                .returning("id")
                .execute();
            }

            return result.id;
        });

        return updatedRideLogId;
    }

    async deleteLog(rideLog: RideLog): Promise<string> {
        return await this.db.transaction().execute(async (trx) => {
            const result = await trx
            .deleteFrom(RIDE_LOG_TABLE)
            .where("id", "=", rideLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .deleteFrom(ODOMETER_LOG_TABLE)
            .where("id", "=", rideLog.startOdometer.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .deleteFrom(ODOMETER_LOG_TABLE)
            .where("id", "=", rideLog.endOdometer.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            for(const rideExpense of rideLog.rideExpenses) {
                await trx
                .deleteFrom(RIDE_EXPENSE_TABLE)
                .where("id", "=", rideExpense.id)
                .returning("id")
                .executeTakeFirstOrThrow();

                await trx
                .deleteFrom(EXPENSE_TABLE)
                .where("id", "=", rideExpense.expense.id)
                .returning("id")
                .executeTakeFirstOrThrow();
            }

            await trx
            .deleteFrom(RIDE_PLACE_TABLE)
            .where("ride_log_id", "=", result.id)
            .returning("id")
            .execute();

            await trx
            .deleteFrom(RIDE_PASSENGER_TABLE)
            .where("ride_log_id", "=", result.id)
            .returning("id")
            .execute();

            return result.id;
        });
    }
}