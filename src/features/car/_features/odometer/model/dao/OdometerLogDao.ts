import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, OdometerLogTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogMapper } from "../mapper/odometerLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { CursorOptions, CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { FilterCondition } from "../../../../../../database/paginator/AbstractPaginator.ts";
import { OdometerLogFields } from "../../schemas/form/odometerLogForm.ts";
import { OdometerUnitDao } from "./OdometerUnitDao.ts";
import { OdometerLogTypeDao } from "./OdometerLogTypeDao.ts";

export class OdometerLogDao extends Dao<OdometerLogTableRow, OdometerLog, OdometerLogMapper> {
    constructor(db: Kysely<DatabaseType>, odometerUnitDao: OdometerUnitDao, odometerLogTypeDao: OdometerLogTypeDao) {
        super(db, ODOMETER_LOG_TABLE, new OdometerLogMapper(odometerUnitDao, odometerLogTypeDao));
    }

    async getOdometerValueInKmByCarId(carId: string): Promise<number> {
        const result = await this.db
        .selectFrom(ODOMETER_LOG_TABLE)
        .select("value")
        .where("car_id", "=", carId)
        .orderBy("value", "desc")
        .limit(1)
        .executeTakeFirst();

        return result.value ?? 0;
    }

    async create(formResult: OdometerLogFields): Promise<OdometerLog> {
        const odometerLogRow = await this.mapper.formResultToEntity(formResult);
        return await super.create(odometerLogRow);
    }

    async update(formResult: OdometerLogFields): Promise<OdometerLog> {
        const odometerLogRow = await this.mapper.formResultToEntity(formResult);
        return await super.update(odometerLogRow);
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
                mapper: async (entity) => await this.mapper.toDto(entity)
            }
        );
    }
}