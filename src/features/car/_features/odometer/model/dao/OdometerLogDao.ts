import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, OdometerLogTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogMapper } from "../mapper/odometerLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { OdometerDao } from "./OdometerDao.ts";
import { ODOMETER_TABLE } from "../../../../../../database/connector/powersync/tables/odometer.ts";
import { CursorOptions, CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { FilterCondition } from "../../../../../../database/paginator/AbstractPaginator.ts";
import { OdometerLogFields } from "../../schemas/form/odometerLogForm.ts";

export class OdometerLogDao extends Dao<OdometerLogTableRow, OdometerLog, OdometerLogMapper> {
    constructor(db: Kysely<DatabaseType>, odometerDao: OdometerDao) {
        super(db, ODOMETER_LOG_TABLE, new OdometerLogMapper(odometerDao));
    }

    async create(formResult: OdometerLogFields): Promise<OdometerLog> {
        const odometerLogRow = await this.mapper.formResultToEntity(formResult);

        await this.db.transaction().execute(async trx => {
            const odometerLog = await trx
            .insertInto(ODOMETER_LOG_TABLE)
            .values(odometerLogRow)
            .returningAll()
            .executeTakeFirstOrThrow();

            await trx
            .updateTable(ODOMETER_TABLE)
            .set({ value: odometerLog.value })
            .where("car_id", "=", odometerLog.car_id)
            .executeTakeFirstOrThrow();
        });
    }

    paginator(
        cursorOptions: CursorOptions<keyof OdometerLogTableRow>,
        filterBy?: FilterCondition<OdometerLogTableRow> | Array<FilterCondition<OdometerLogTableRow>>,
        perPage?: number = 10
    ): CursorPaginator<OdometerLogTableRow, OdometerLog> {
        return new CursorPaginator<OdometerLogTableRow, OdometerLog>(
            this.db,
            this.table,
            cursorOptions,
            {
                perPage,
                filterBy,
                mapper: (entity) => this.mapper.toDto(entity)
            }
        );
    }
}