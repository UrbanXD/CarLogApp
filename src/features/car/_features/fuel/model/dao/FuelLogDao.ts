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


    async update(formResult: FuelLogFields): Promise<FuelLog | null> {
        const { expense, fuelLog, odometerLog } = await this.mapper.formResultToEntities(formResult);

        const updatedFuelLogId = await this.db.transaction().execute(async trx => {
            await trx
            .updateTable(EXPENSE_TABLE)
            .set(expense)
            .where("id", "=", expense.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            const originalFuelLog = await trx
            .selectFrom(FUEL_LOG_TABLE)
            .select("odometer_log_id as odometerLogId")
            .where("id", "=", fuelLog.id)
            .executeTakeFirst();

            if(originalFuelLog?.odometerLogId && !odometerLog) {
                await trx
                .deleteFrom(ODOMETER_LOG_TABLE)
                .where("id", "=", originalFuelLog.odometerLogId)
                .returning("id")
                .executeTakeFirstOrThrow();
            } else if(odometerLog) {
                if(originalFuelLog?.odometerLogId === odometerLog.id) {
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
            .updateTable(FUEL_LOG_TABLE)
            .set(fuelLog)
            .where("id", "=", fuelLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            return result.id;
        });

        return await this.getById(updatedFuelLogId);
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