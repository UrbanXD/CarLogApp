import { Dao } from "../../../../../../database/dao/Dao.ts";
import {
    DatabaseType,
    OdometerLogTableRow,
    OdometerLogTypeTableRow,
    OdometerUnitTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogMapper } from "../mapper/odometerLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { CursorOptions, CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { PaginatorOptions } from "../../../../../../database/paginator/AbstractPaginator.ts";
import { OdometerChangeLogFormFields } from "../../schemas/form/odometerChangeLogForm.ts";
import { OdometerLogTypeDao } from "./OdometerLogTypeDao.ts";
import { FUEL_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/fuelLog.ts";
import { ODOMETER_CHANGE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerChangeLog.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";
import { SelectQueryBuilder, sql } from "kysely";
import { OdometerLogTypeEnum } from "../enums/odometerLogTypeEnum.ts";
import { SERVICE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/serviceLog.ts";
import { RIDE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/rideLog.ts";
import { CAR_TABLE } from "../../../../../../database/connector/powersync/tables/car.ts";
import { ODOMETER_UNIT_TABLE } from "../../../../../../database/connector/powersync/tables/odometerUnit.ts";
import { formatDateToDatabaseFormat } from "../../../../../statistics/utils/formatDateToDatabaseFormat.ts";
import { WithPrefix } from "../../../../../../types";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { ODOMETER_LOG_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLogType.ts";

export type SelectOdometerLogTableRow =
    OdometerLogTableRow &
    WithPrefix<OdometerUnitTableRow, "unit"> &
    {
        related_id: string | null
        type_key: OdometerLogTypeTableRow["key"]
        note: string | null
        date: string | null
    };

export type SelectOdometerTableRow =
    WithPrefix<Omit<OdometerLogTableRow, "type_id">, "log">
    & WithPrefix<OdometerUnitTableRow, "unit">

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

    selectQuery(id?: any | null): SelectQueryBuilder<DatabaseType, any, SelectOdometerLogTableRow> {
        let query = this.db
        .selectFrom(`${ ODOMETER_LOG_TABLE } as ol` as const)
        .innerJoin(`${ ODOMETER_LOG_TYPE_TABLE } as ot` as const, "ot.id", "ol.type_id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "c.id", "ol.car_id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as u` as const, "u.id", "c.odometer_unit_id")
        .leftJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as ocl` as const, "ocl.odometer_log_id", "ol.id")
        .leftJoin(`${ FUEL_LOG_TABLE } as fl` as const, "fl.odometer_log_id", "ol.id")
        .leftJoin(`${ SERVICE_LOG_TABLE } as sl` as const, "sl.odometer_log_id", "ol.id")
        .leftJoin(`${ RIDE_LOG_TABLE } as rl1` as const, "rl1.start_odometer_log_id", "ol.id")
        .leftJoin(`${ RIDE_LOG_TABLE } as rl2` as const, "rl2.end_odometer_log_id", "ol.id")
        .leftJoin(`${ EXPENSE_TABLE } as e1` as const, "e1.id", "fl.expense_id")
        .leftJoin(`${ EXPENSE_TABLE } as e2` as const, "e2.id", "sl.expense_id")
        .selectAll("ol")
        .select((eb) => [
            "ot.key as type_key",
            "u.id as unit_id",
            "u.key as unit_key",
            "u.short as unit_short",
            "u.conversion_factor as unit_conversion_factor",
            eb.fn.coalesce(
                "e1.date",
                "e2.date",
                "ocl.date",
                "rl1.start_time",
                eb.fn.coalesce("rl2.end_time", eb.val("1970-01-01"))
            ).$castTo<string>().as("date"),
            eb.fn.coalesce(
                "e1.note",
                "e2.note",
                "ocl.note"
            ).$castTo<string | null>().as("note"),
            eb.fn.coalesce(
                "fl.id",
                "ocl.id",
                "sl.id",
                "rl1.id",
                "rl2.id"
            ).$castTo<string | null>().as("related_id")
        ]);

        if(id) query = query.where("ol.id", "=", id);

        return query;
    }

    async getOdometerLimitByDate(
        carId: string,
        date: string,
        skipOdometerLogs: Array<string> = []
    ): Promise<OdometerLimit> {
        let baseQuery = this.db
        .selectFrom(`${ ODOMETER_LOG_TABLE } as t1` as const)
        .innerJoin(`${ CAR_TABLE } as t2` as const, "t1.car_id", "t2.id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t3` as const, "t2.odometer_unit_id", "t3.id")
        .leftJoin(`${ ODOMETER_CHANGE_LOG_TABLE } as t4` as const, "t1.id", "t4.odometer_log_id")
        .leftJoin(`${ FUEL_LOG_TABLE } as t5` as const, "t1.id", "t5.odometer_log_id")
        .leftJoin(`${ SERVICE_LOG_TABLE } as t6` as const, "t1.id", "t6.odometer_log_id")
        .leftJoin(`${ EXPENSE_TABLE } as t7` as const, "t5.expense_id", "t7.id")
        .leftJoin(`${ EXPENSE_TABLE } as t8` as const, "t6.expense_id", "t8.id")
        .leftJoin(`${ RIDE_LOG_TABLE } as t9` as const, "t1.id", "t9.start_odometer_log_id")
        .leftJoin(`${ RIDE_LOG_TABLE } as t10` as const, "t1.id", "t10.end_odometer_log_id")
        .where("t1.car_id", "=", carId)
        .where("t1.id", "not in", skipOdometerLogs)
        .where(
            sql`COALESCE(t10.end_time, t9.start_time, t8.date, t7.date, t4.date)`,
            "is not",
            null
        );

        const unitResult = await this.db
        .selectFrom(`${ CAR_TABLE } as t1`)
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as t2`, "t1.odometer_unit_id", "t2.id")
        .select("t2.short as unit")
        .where("t1.id", "=", carId)
        .executeTakeFirst();

        const minQuery = baseQuery
        .select([
            sql`MAX(ROUND(t1.value / t3.conversion_factor))`.as("odometer_value"),
            sql`COALESCE(t10.end_time, t9.start_time, t8.date, t7.date, t4.date)`.as("date")
        ])
        .where(
            sql`COALESCE(t10.end_time, t9.start_time, t8.date, t7.date, t4.date)`,
            "<",
            formatDateToDatabaseFormat(date)
        );

        const maxQuery = baseQuery
        .select([
            sql`MIN(ROUND(t1.value / t3.conversion_factor))`.as("odometer_value"),
            sql`COALESCE(t10.end_time, t9.start_time, t8.date, t7.date, t4.date)`.as("date")
        ])
        .where(
            sql`COALESCE(t10.end_time, t9.start_time, t8.date, t7.date, t4.date)`,
            ">",
            formatDateToDatabaseFormat(date)
        );

        const minResult = await minQuery.executeTakeFirst();
        const maxResult = await maxQuery.executeTakeFirst();

        const formatResult = (result: any) => {
            if(result && typeof result.odometer_value === "number" && result.date) {
                return {
                    value: result.odometer_value,
                    date: String(result.date)
                };
            }
            return null;
        };

        return {
            min: formatResult(minResult),
            max: formatResult(maxResult),
            unitText: unitResult?.unit ?? ""
        };
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

    paginator(
        cursorOptions: CursorOptions<keyof SelectOdometerLogTableRow>,
        filterBy?: PaginatorOptions<SelectOdometerLogTableRow>["filterBy"],
        perPage: number = 25
    ): CursorPaginator<SelectOdometerLogTableRow, OdometerLog> {
        return new CursorPaginator<SelectOdometerLogTableRow, OdometerLog>(
            this.db,
            this.table,
            cursorOptions,
            {
                baseQuery: this.selectQuery(),
                perPage,
                filterBy: filterBy,
                mapper: async (entity) => await this.mapper.toDto(entity)
            }
        );
    }
}