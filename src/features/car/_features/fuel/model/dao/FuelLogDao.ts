import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, FuelLogTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelLog } from "../../schemas/fuelLogSchema.ts";
import { FuelLogMapper } from "../mapper/fuelLogMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ExpenseTypeDao } from "../../../../../expense/model/dao/ExpenseTypeDao.ts";
import { FuelUnitDao } from "./FuelUnitDao.ts";
import { FUEL_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/fuelLog.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";
import { OdometerLogDao } from "../../../odometer/model/dao/OdometerLogDao.ts";
import { FuelLogFields } from "../../schemas/form/fuelLogForm.ts";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { OdometerUnitDao } from "../../../odometer/model/dao/OdometerUnitDao.ts";
import { SelectQueryBuilder } from "kysely";
import { ExpenseDao } from "../../../../../expense/model/dao/ExpenseDao.ts";

export class FuelLogDao extends Dao<FuelLogTableRow, FuelLog, FuelLogMapper> {
    constructor(
        db: Kysely<DatabaseType>,
        fuelUnitDao: FuelUnitDao,
        expenseDao: ExpenseDao,
        expenseTypeDao: ExpenseTypeDao,
        odometerLogDao: OdometerLogDao,
        odometerUnitDao: OdometerUnitDao
    ) {
        super(
            db,
            FUEL_LOG_TABLE,
            new FuelLogMapper(fuelUnitDao, expenseDao, expenseTypeDao, odometerLogDao, odometerUnitDao)
        );
    }


    selectQuery(): SelectQueryBuilder<DatabaseType, FuelLogTableRow> {
        return this.db
        .selectFrom(FUEL_LOG_TABLE)
        .innerJoin(EXPENSE_TABLE, `${ EXPENSE_TABLE }.id`, `${ FUEL_LOG_TABLE }.expense_id`)
        .selectAll(FUEL_LOG_TABLE)
        .select([
            `${ EXPENSE_TABLE }.car_id as car_id`,
            `${ EXPENSE_TABLE }.amount as amount`,
            `${ EXPENSE_TABLE }.original_amount as original_amount`,
            `${ EXPENSE_TABLE }.exchange_rate as exchange_rate`
        ]);
    }

    async create(formResult: FuelLogFields): Promise<FuelLog | null> {
        const { expense, fuelLog, odometerLog } = await this.mapper.formResultToEntities(formResult);

        const insertedFuelLogId = await this.db.transaction().execute(async trx => {
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
            .insertInto(FUEL_LOG_TABLE)
            .values(fuelLog)
            .returning("id")
            .executeTakeFirstOrThrow();

            return result.id;
        });

        return await this.getById(insertedFuelLogId);
    }


    async delete(fuelLog: FuelLog): Promise<string | number> {
        return await this.db.transaction().execute(async trx => {
            const result = await trx
            .deleteFrom(FUEL_LOG_TABLE)
            .where("id", "=", fuelLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .deleteFrom(EXPENSE_TABLE)
            .where("id", "=", fuelLog.expense.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            if(!!fuelLog.odometer) {
                await trx
                .deleteFrom(ODOMETER_LOG_TABLE)
                .where("id", "=", fuelLog.odometer.id)
                .returning("id")
                .executeTakeFirstOrThrow();
            }

            return result.id;
        });
    }
}