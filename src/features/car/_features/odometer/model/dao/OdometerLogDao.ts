import { Dao } from "../../../../../../database/dao/Dao.ts";
import {
    CurrencyTableRow,
    DatabaseType,
    OdometerLogTableRow,
    OdometerLogTypeTableRow,
    OdometerUnitTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogMapper } from "../mapper/odometerLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { OdometerChangeLogFormFields } from "../../schemas/form/odometerChangeLogForm.ts";
import { OdometerLogTypeDao } from "./OdometerLogTypeDao.ts";
import { FUEL_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/fuelLog.ts";
import { ODOMETER_CHANGE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerChangeLog.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";
import { ExpressionBuilder, SelectQueryBuilder, sql } from "kysely";
import { OdometerLogTypeEnum } from "../enums/odometerLogTypeEnum.ts";
import { SERVICE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/serviceLog.ts";
import { RIDE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/rideLog.ts";
import { CAR_TABLE } from "../../../../../../database/connector/powersync/tables/car.ts";
import { ODOMETER_UNIT_TABLE } from "../../../../../../database/connector/powersync/tables/odometerUnit.ts";
import { formatDateToDatabaseFormat } from "../../../../../statistics/utils/formatDateToDatabaseFormat.ts";
import { WithPrefix } from "../../../../../../types";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { ODOMETER_LOG_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLogType.ts";
import { UseWatchedQueryItemProps } from "../../../../../../database/hooks/useWatchedQueryItem.ts";
import { WatchQueryOptions } from "../../../../../../database/watcher/watcher.ts";
import { MODEL_TABLE } from "../../../../../../database/connector/powersync/tables/model.ts";
import { MAKE_TABLE } from "../../../../../../database/connector/powersync/tables/make.ts";
import { SelectCarModelTableRow } from "../../../../model/dao/CarDao.ts";
import { UseInfiniteQueryOptions } from "../../../../../../database/hooks/useInfiniteQuery.ts";
import { CURRENCY_TABLE } from "../../../../../../database/connector/powersync/tables/currency.ts";
import { StatisticsFunctionArgs } from "../../../../../statistics/model/dao/statisticsDao.ts";

export type SelectOdometerLogTableRow =
    OdometerLogTableRow
    & WithPrefix<OdometerUnitTableRow, "unit">
    & WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">
    & WithPrefix<CurrencyTableRow, "car_currency">
    &
    {
        related_id: string | null
        type_key: OdometerLogTypeTableRow["key"]
        note: string | null
        date: string | null
    };

export type SelectOdometerTableRow =
    WithPrefix<Omit<OdometerLogTableRow, "type_id">, "log">
    & WithPrefix<OdometerUnitTableRow, "unit">

export type SelectOdometerLimitTableRow = {
    min_value: number | null
    min_date: string | null
    max_value: number | null
    max_date: string | null
    unit: string | null
}

export type OdometerLimit = {
    min: { value: number, date: string } | null,
    max: { value: number, date: string } | null,
    unitText: string
}

export class OdometerLogDao extends Dao<OdometerLogTableRow, OdometerLog, OdometerLogMapper, SelectOdometerLogTableRow> {
    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        odometerLogTypeDao: OdometerLogTypeDao
    ) {
        super(db, powersync, ODOMETER_LOG_TABLE, new OdometerLogMapper(odometerLogTypeDao));
    }

    dateExpression(eb: ReturnType<OdometerLogDao["baseQuery"]> extends SelectQueryBuilder<infer DB, infer TB, any>
                       ? ExpressionBuilder<DB, TB>
                       : never) {
        return eb.fn.coalesce(
            "fl_e.date",
            "sl_e.date",
            "ocl.date",
            "s_rl.start_time",
            eb.fn.coalesce("e_rl.end_time", eb.val("1970-01-01"))
        ).$castTo<string>();
    }

    baseQuery() {
        return this.db
        .selectFrom(`${ ODOMETER_LOG_TABLE } as ol` as const)
        .innerJoin(`${ CAR_TABLE } as c` as const, "ol.car_id", "c.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "c.odometer_unit_id", "ou.id")
        .leftJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as ocl` as const, "ol.id", "ocl.odometer_log_id")
        .leftJoin(`${ FUEL_LOG_TABLE } as fl` as const, "ol.id", "fl.odometer_log_id")
        .leftJoin(`${ SERVICE_LOG_TABLE } as sl` as const, "ol.id", "sl.odometer_log_id")
        .leftJoin(`${ EXPENSE_TABLE } as fl_e` as const, "fl.expense_id", "fl_e.id")
        .leftJoin(`${ EXPENSE_TABLE } as sl_e` as const, "sl.expense_id", "sl_e.id")
        .leftJoin(`${ RIDE_LOG_TABLE } as s_rl` as const, "ol.id", "s_rl.start_odometer_log_id")
        .leftJoin(`${ RIDE_LOG_TABLE } as e_rl` as const, "ol.id", "e_rl.end_odometer_log_id");
    }

    selectQuery(id?: any | null) {
        let query = this.baseQuery()
        .innerJoin(`${ ODOMETER_LOG_TYPE_TABLE } as ot` as const, "ot.id", "ol.type_id")
        .innerJoin(`${ MODEL_TABLE } as mo` as const, "mo.id", "c.model_id")
        .innerJoin(`${ MAKE_TABLE } as ma` as const, "ma.id", "mo.make_id")
        .innerJoin(`${ CURRENCY_TABLE } as ccurr` as const, "c.currency_id", "ccurr.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as u` as const, "u.id", "c.odometer_unit_id")
        .selectAll("ol")
        .select((eb) => [
            "c.name as car_name",
            "mo.id as car_model_id",
            "mo.name as car_model_name",
            "c.model_year as car_model_year",
            "ccurr.id as car_currency_id",
            "ccurr.key as car_currency_key",
            "ccurr.symbol as car_currency_symbol",
            "ma.id as car_make_id",
            "ma.name as car_make_name",
            "ot.key as type_key",
            "u.id as unit_id",
            "u.key as unit_key",
            "u.short as unit_short",
            "u.conversion_factor as unit_conversion_factor",
            this.dateExpression(eb).as("date"),
            eb.fn.coalesce(
                "fl_e.note",
                "sl_e.note",
                "ocl.note"
            ).$castTo<string | null>().as("note"),
            eb.fn.coalesce(
                "fl.id",
                "ocl.id",
                "sl.id",
                "s_rl.id",
                "e_rl.id"
            ).$castTo<string | null>().as("related_id")
        ]);

        if(id) query = query.where("ol.id", "=", id);

        return query;
    }

    odometerQuery({
        carId,
        from,
        to
    }: Omit<StatisticsFunctionArgs, "trendOptions">) {
        return this.baseQuery()
        .$if(!!carId, (qb) => qb.where("c.id", "=", carId!))
        .where((eb) => {
            const dateExpression = this.dateExpression(eb);

            return eb.and([
                eb(dateExpression, "is not", null),
                eb(dateExpression, ">=", formatDateToDatabaseFormat(from)),
                eb(dateExpression, "<=", formatDateToDatabaseFormat(to))
            ]);
        })
        .orderBy((eb) => this.dateExpression(eb), "asc")
        .orderBy("ol.value", "asc")
        .orderBy("ol.id", "asc");
    }

    odometerLimitQuery(
        carId: string,
        date: string,
        skipOdometerLogs: Array<OdometerLogTableRow["id"]> = []
    ): SelectQueryBuilder<DatabaseType, any, SelectOdometerLimitTableRow> {
        const dbDate = formatDateToDatabaseFormat(date);
        const dateSql = sql`COALESCE(t10.end_time, t9.start_time, t8.date, t7.date, t4.date)`;

        return this.db
        .selectFrom(`${ CAR_TABLE } as t2` as const)
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t3` as const, "t2.odometer_unit_id", "t3.id")
        .leftJoin(`${ ODOMETER_LOG_TABLE } as t1` as const, (join) =>
            join.onRef("t1.car_id", "=", "t2.id")
            .on("t1.id", "not in", skipOdometerLogs.length > 0 ? skipOdometerLogs : [""])
        )
        .leftJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as t4` as const, "t1.id", "t4.odometer_log_id")
        .leftJoin(`${ FUEL_LOG_TABLE } as t5` as const, "t1.id", "t5.odometer_log_id")
        .leftJoin(`${ SERVICE_LOG_TABLE } as t6` as const, "t1.id", "t6.odometer_log_id")
        .leftJoin(`${ EXPENSE_TABLE } as t7` as const, "t5.expense_id", "t7.id")
        .leftJoin(`${ EXPENSE_TABLE } as t8` as const, "t6.expense_id", "t8.id")
        .leftJoin(`${ RIDE_LOG_TABLE } as t9` as const, "t1.id", "t9.start_odometer_log_id")
        .leftJoin(`${ RIDE_LOG_TABLE } as t10` as const, "t1.id", "t10.end_odometer_log_id")
        .select([
            //@formatter:off
            "t3.short as unit",
            sql<number | null>`
              MAX(CASE 
              WHEN ${dateSql} < ${dbDate} 
                THEN ROUND(t1.value / t3.conversion_factor) 
              END)
            `.as("min_value"),
            sql<string | null>`
              MAX(CASE 
                WHEN ${dateSql} < ${dbDate} 
                THEN ${dateSql} 
              END)
            `.as("min_date"),
            sql<number | null>`
              MIN(CASE 
                WHEN ${dateSql} > ${dbDate} 
                THEN ROUND(t1.value / t3.conversion_factor) 
              END)
            `.as("max_value"),
            sql<string | null>`
              MIN(CASE 
                WHEN ${dateSql} > ${dbDate} 
                THEN ${dateSql} 
              END)
            `.as("max_date")
            //@formatter:on
        ])
        .where("t2.id", "=", carId)
        .groupBy(["t3.short", "t2.id"]);
    }

    odometerLogWatchedQueryItem(
        id: string | null | undefined,
        options?: WatchQueryOptions
    ): UseWatchedQueryItemProps<OdometerLog> {
        return {
            query: this.selectQuery(id),
            mapper: this.mapper.toDto.bind(this.mapper),
            options: { enabled: !!id, ...options }
        };
    }

    odometerLimitWatchedQueryItem(
        carId: string | null | undefined,
        date: string | null | undefined,
        skipOdometerLogs: Array<string> = [],
        enabled: boolean = true
    ): UseWatchedQueryItemProps<OdometerLimit> {
        return {
            query: this.odometerLimitQuery(carId!, date!, skipOdometerLogs),
            mapper: this.mapper.toOdometerLimitDto.bind(this.mapper),
            options: { enabled: enabled && !!carId && !!date }
        };
    }

    timelineInfiniteQuery(carId: string): UseInfiniteQueryOptions<ReturnType<OdometerLogDao["selectQuery"]>, OdometerLog> {
        return {
            baseQuery: this.selectQuery(),
            defaultCursorOptions: {
                cursor: [
                    { field: "ol.value", order: "desc" },
                    { field: "ol.id", order: "desc" }
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

    async getOdometerLimitByDate(
        carId: string,
        date: string,
        skipOdometerLogs: Array<string> = []
    ): Promise<OdometerLimit> {
        let result = await this.odometerLimitQuery(carId, date, skipOdometerLogs).executeTakeFirstOrThrow();

        return this.mapper.toOdometerLimitDto(result);
    }

    async createOdometerChangeLog(formResult: OdometerChangeLogFormFields): Promise<OdometerLog> {
        const { odometerLog, odometerChangeLog } = this.mapper.formResultToEntity(formResult);

        const insertedOdometerLogId = await this.db.transaction().execute(async trx => {
            const result = await trx
            .insertInto(ODOMETER_LOG_TABLE)
            .values({ ...odometerLog, type_id: OdometerLogTypeEnum.SIMPLE })
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .insertInto(ODOMETER_CHANGE_LOG_TABLE)
            .values(odometerChangeLog)
            .executeTakeFirstOrThrow();

            return result.id;
        });

        const result = await this.getById(insertedOdometerLogId);
        if(!result) throw new Error("Cannot get odometer log at insertOdometerChangeLOG");
        return result;
    }

    async updateOdometerChangeLog(formResult: OdometerChangeLogFormFields): Promise<OdometerLog> {
        const { odometerLog, odometerChangeLog } = this.mapper.formResultToEntity(formResult);

        const updatedOdometerLogId = await this.db.transaction().execute(async trx => {
            const result = await trx
            .updateTable(ODOMETER_LOG_TABLE)
            .set(odometerLog)
            .where("id", "=", odometerLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .updateTable(ODOMETER_CHANGE_LOG_TABLE)
            .set(odometerChangeLog)
            .where("id", "=", odometerChangeLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            return result.id;
        });

        const result = await this.getById(updatedOdometerLogId);
        if(!result) throw new Error("Cannot get odometer log at updateOdometerChangeLOG");
        return result;
    }


    async deleteOdometerChangeLog(odometerLogId: string, id: string): Promise<string> {
        return await this.db.transaction().execute(async trx => {
            const result = await trx
            .deleteFrom(ODOMETER_LOG_TABLE)
            .where("id", "=", odometerLogId)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .deleteFrom(ODOMETER_CHANGE_LOG_TABLE)
            .where("id", "=", id)
            .returning("id")
            .executeTakeFirstOrThrow();

            return result.id;
        });
    }
}