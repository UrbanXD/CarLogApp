import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, OdometerLogTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogMapper } from "../mapper/odometerLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { CursorOptions, CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { FilterCondition } from "../../../../../../database/paginator/AbstractPaginator.ts";
import { OdometerChangeLogFormFields } from "../../schemas/form/odometerChangeLogForm.ts";
import { OdometerUnitDao } from "./OdometerUnitDao.ts";
import { OdometerLogTypeDao } from "./OdometerLogTypeDao.ts";
import { Odometer } from "../../schemas/odometerSchema.ts";
import { FUEL_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/fuelLog.ts";
import { ODOMETER_CHANGE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerChangeLog.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";
import { SelectQueryBuilder } from "kysely";
import { OdometerLogTypeEnum } from "../enums/odometerLogTypeEnum.ts";

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
        .leftJoin(FUEL_LOG_TABLE, `${ FUEL_LOG_TABLE }.odometer_log_id`, `${ ODOMETER_LOG_TABLE }.id`)
        .leftJoin(EXPENSE_TABLE, `${ EXPENSE_TABLE }.id`, `${ FUEL_LOG_TABLE }.expense_id`)
        .leftJoin(
            ODOMETER_CHANGE_LOG_TABLE,
            `${ ODOMETER_CHANGE_LOG_TABLE }.odometer_log_id`,
            `${ ODOMETER_LOG_TABLE }.id`
        )
        .select([
            `${ ODOMETER_LOG_TABLE }.id`,
            `${ ODOMETER_LOG_TABLE }.car_id`,
            `${ ODOMETER_LOG_TABLE }.value`,
            `${ ODOMETER_LOG_TABLE }.type_id`,
            eb => eb.fn.coalesce(`${ EXPENSE_TABLE }.date`, `${ ODOMETER_CHANGE_LOG_TABLE }.date`).as("date"),
            eb => eb.fn.coalesce(`${ EXPENSE_TABLE }.note`, `${ ODOMETER_CHANGE_LOG_TABLE }.note`).as("note"),
            eb => eb.fn.coalesce(`${ FUEL_LOG_TABLE }.id`, `${ ODOMETER_CHANGE_LOG_TABLE }.id`).as("related_id")
        ]);
    }

    async getOdometerByCarId(carId: string): Promise<Odometer | null> {
        const result = await this.db
        .selectFrom(ODOMETER_LOG_TABLE)
        .selectAll()
        .where("car_id", "=", carId)
        .orderBy("value", "desc")
        .limit(1)
        .executeTakeFirst();

        return result ? await this.mapper.toOdometerDto(result) : null;
    }

    async getOdometerByLogId(logId: string, safe?: boolean): Promise<Odometer | null> {
        const entity = await this.db
        .selectFrom(ODOMETER_LOG_TABLE)
        .selectAll()
        .where("id", "=", logId)
        .executeTakeFirst();

        if(safe && !entity) throw new Error(`Table item not found by ${ logId } id. [${ ODOMETER_LOG_TABLE }]`);

        return entity ? await this.mapper.toOdometerDto(entity) : null;
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
            .executeTakeFirstOrThrow();

            return result.id;
        });

        return await this.getById(updatedOdometerLogId);
    }

    paginator(
        cursorOptions: CursorOptions<keyof SelectOdometerLogTableRow>,
        filterBy?: FilterCondition<SelectOdometerLogTableRow> | Array<FilterCondition<SelectOdometerLogTableRow>>,
        perPage?: number = 10
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