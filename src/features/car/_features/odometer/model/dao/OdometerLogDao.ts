import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, OdometerLogTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogMapper } from "../mapper/odometerLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { CursorOptions, CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { PaginatorOptions } from "../../../../../../database/paginator/AbstractPaginator.ts";
import { OdometerChangeLogFormFields } from "../../schemas/form/odometerChangeLogForm.ts";
import { OdometerUnitDao } from "./OdometerUnitDao.ts";
import { OdometerLogTypeDao } from "./OdometerLogTypeDao.ts";
import { Odometer } from "../../schemas/odometerSchema.ts";
import { FUEL_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/fuelLog.ts";
import { ODOMETER_CHANGE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerChangeLog.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";
import { SelectQueryBuilder } from "kysely";
import { OdometerLogTypeEnum } from "../enums/odometerLogTypeEnum.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { SERVICE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/serviceLog.ts";

export type SelectOdometerLogTableRow = OdometerLogTableRow & {
    note: string | null,
    date: string | null,
    related_id: string | null
};

export class OdometerLogDao extends Dao<OdometerLogTableRow, OdometerLog, OdometerLogMapper, SelectOdometerLogTableRow> {
    constructor(db: Kysely<DatabaseType>, odometerUnitDao: OdometerUnitDao, odometerLogTypeDao: OdometerLogTypeDao) {
        super(db, ODOMETER_LOG_TABLE, new OdometerLogMapper(odometerUnitDao, odometerLogTypeDao));
    }

    selectQuery(): SelectQueryBuilder<OdometerLogTableRow> {
        return this.db
        .selectFrom(ODOMETER_LOG_TABLE)
        .leftJoin(
            ODOMETER_CHANGE_LOG_TABLE,
            `${ ODOMETER_CHANGE_LOG_TABLE }.odometer_log_id`,
            `${ ODOMETER_LOG_TABLE }.id`
        )
        .leftJoin(FUEL_LOG_TABLE, `${ FUEL_LOG_TABLE }.odometer_log_id`, `${ ODOMETER_LOG_TABLE }.id`)
        .leftJoin(SERVICE_LOG_TABLE, `${ SERVICE_LOG_TABLE }.odometer_log_id`, `${ ODOMETER_LOG_TABLE }.id`)
        .leftJoin(`${ EXPENSE_TABLE } as e1`, "e1.id", `${ FUEL_LOG_TABLE }.expense_id`)
        .leftJoin(`${ EXPENSE_TABLE } as e2`, "e2.id", `${ SERVICE_LOG_TABLE }.expense_id`)
        .select([
            `${ ODOMETER_LOG_TABLE }.id`,
            `${ ODOMETER_LOG_TABLE }.car_id`,
            `${ ODOMETER_LOG_TABLE }.value`,
            `${ ODOMETER_LOG_TABLE }.type_id`,
            eb => eb.fn.coalesce("e1.date", "e2.date", `${ ODOMETER_CHANGE_LOG_TABLE }.date`, eb.val("1970-01-01")).as(
                "date"),
            eb => eb.fn.coalesce("e1.note", "e2.note", `${ ODOMETER_CHANGE_LOG_TABLE }.note`).as("note"),
            eb => eb.fn.coalesce(
                `${ FUEL_LOG_TABLE }.id`,
                `${ ODOMETER_CHANGE_LOG_TABLE }.id`,
                `${ SERVICE_LOG_TABLE }.id`
            ).as("related_id")
        ]);
    }

    async getOdometerByCarId(carId: string): Promise<Odometer> {
        const result = await this.db
        .selectFrom(ODOMETER_LOG_TABLE)
        .selectAll()
        .where("car_id", "=", carId)
        .orderBy("value", "desc")
        .limit(1)
        .executeTakeFirst();

        const defaultOdometer: OdometerLogTableRow = { // when no odometer found fallback to 0
            id: getUUID(),
            car_id: carId,
            value: 0
        };

        return await this.mapper.toOdometerDto(result ?? defaultOdometer);
    }

    async getOdometerByLogId(logId: string, fallbackCarId: string): Promise<Odometer> {
        const entity = await this.db
        .selectFrom(ODOMETER_LOG_TABLE)
        .selectAll()
        .where("id", "=", logId)
        .orderBy("value", "desc")
        .executeTakeFirst();

        const defaultOdometer: OdometerLogTableRow = { // when no odometer found fallback to 0
            id: getUUID(),
            car_id: fallbackCarId,
            value: 0
        };

        return await this.mapper.toOdometerDto(entity ?? defaultOdometer);
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

        return await this.getById(insertedOdometerLogId);
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

        return await this.getById(updatedOdometerLogId);
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
        perPage?: number = 25
    ): CursorPaginator<SelectOdometerLogTableRow, OdometerLog> {
        return new CursorPaginator<OdometerLogTableRow, OdometerLog>(
            this.db,
            this.table,
            cursorOptions,
            {
                baseQuery: this.selectQuery(),
                perPage,
                filterBy,
                mapper: async (entity) => await this.mapper.toDto(entity)
            }
        );
    }
}