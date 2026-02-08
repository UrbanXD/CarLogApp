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
import { ExpressionBuilder, SelectQueryBuilder } from "kysely";
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
import { odometerValueExpression } from "../../../../../../database/dao/expressions";
import { StatisticsFunctionArgs } from "../../../../../../database/dao/types/statistics.ts";

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
        return this.baseQuery()
        .innerJoin(`${ ODOMETER_LOG_TYPE_TABLE } as ot` as const, "ot.id", "ol.type_id")
        .innerJoin(`${ MODEL_TABLE } as mo` as const, "mo.id", "c.model_id")
        .innerJoin(`${ MAKE_TABLE } as ma` as const, "ma.id", "mo.make_id")
        .innerJoin(`${ CURRENCY_TABLE } as ccurr` as const, "c.currency_id", "ccurr.id")
        .select((eb) => [
            "ol.id",
            odometerValueExpression(eb, "ol.value", "ou.conversion_factor").as("value"),
            "c.id as car_id",
            "c.name as car_name",
            "mo.id as car_model_id",
            "mo.name as car_model_name",
            "c.model_year as car_model_year",
            "ccurr.id as car_currency_id",
            "ccurr.key as car_currency_key",
            "ccurr.symbol as car_currency_symbol",
            "ma.id as car_make_id",
            "ma.name as car_make_name",
            "ot.id as type_id",
            "ot.key as type_key",
            "ou.id as unit_id",
            "ou.key as unit_key",
            "ou.short as unit_short",
            "ou.conversion_factor as unit_conversion_factor",
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
        ])
        .$if(!!id, (qb) => qb.where("ol.id", "=", id!));
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
        .orderBy((eb) => odometerValueExpression(eb, "ol.value", "ou.conversion_factor"), "asc")
        .orderBy("ol.id", "asc");
    }

    odometerLimitQuery(
        carId: string,
        date: string,
        skipOdometerLogs: Array<OdometerLogTableRow["id"]> = []
    ): SelectQueryBuilder<DatabaseType, any, SelectOdometerLimitTableRow> {
        const dbDate = formatDateToDatabaseFormat(date);

        return this.db
        .selectFrom(`${ CAR_TABLE } as c` as const)
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as ou` as const, "c.odometer_unit_id", "ou.id")
        .leftJoin(`${ ODOMETER_LOG_TABLE } as ol` as const, (join) =>
            join.onRef("ol.car_id", "=", "c.id")
            .on("ol.id", "not in", skipOdometerLogs.length > 0 ? skipOdometerLogs : [""])
        )
        .leftJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as ocl` as const, "ol.id", "ocl.odometer_log_id")
        .leftJoin(`${ FUEL_LOG_TABLE } as fl` as const, "ol.id", "fl.odometer_log_id")
        .leftJoin(`${ SERVICE_LOG_TABLE } as sl` as const, "ol.id", "sl.odometer_log_id")
        .leftJoin(`${ EXPENSE_TABLE } as fl_e` as const, "fl.expense_id", "fl_e.id")
        .leftJoin(`${ EXPENSE_TABLE } as sl_e` as const, "sl.expense_id", "sl_e.id")
        .leftJoin(`${ RIDE_LOG_TABLE } as s_rl` as const, "ol.id", "s_rl.start_odometer_log_id")
        .leftJoin(`${ RIDE_LOG_TABLE } as e_rl` as const, "ol.id", "e_rl.end_odometer_log_id")
        .select((eb) => {
            const dateExpression = eb.fn.coalesce(
                "e_rl.end_time",
                "s_rl.start_time",
                "fl_e.date",
                "sl_e.date",
                "ocl.date"
            );

            const odometerExpression = odometerValueExpression(eb, "ol.value", "ou.conversion_factor");

            return [
                "ou.short as unit",
                eb.fn.max(
                    eb.case()
                    .when(dateExpression, "<", dbDate)
                    .then(odometerExpression)
                    .end()
                ).as("min_value"),
                eb.fn.max(
                    eb.case()
                    .when(dateExpression, "<", dbDate)
                    .then(dateExpression)
                    .end()
                ).as("min_date"),
                eb.fn.min(
                    eb.case()
                    .when(dateExpression, ">", dbDate)
                    .then(odometerExpression)
                    .end()
                ).as("max_value"),
                eb.fn.min(
                    eb.case()
                    .when(dateExpression, ">", dbDate)
                    .then(dateExpression)
                    .end()
                ).as("max_date")
            ];
        })
        .where("c.id", "=", carId);
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