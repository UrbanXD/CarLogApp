import { Dao } from "../../../../../../database/dao/Dao.ts";
import {
    DatabaseType,
    ExpenseTableRow,
    ServiceLogTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceLog } from "../../schemas/serviceLogSchema.ts";
import { ServiceLogMapper } from "../mapper/ServiceLogMapper.ts";
import { ExpenseDao } from "../../../../model/dao/ExpenseDao.ts";
import { OdometerLogDao } from "../../../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { ServiceTypeDao } from "./ServiceTypeDao.ts";
import { SERVICE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/serviceLog.ts";
import { Kysely } from "@powersync/kysely-driver";
import { ServiceLogFields } from "../../schemas/form/serviceLogForm.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { SERVICE_ITEM_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItem.ts";
import { OdometerUnitDao } from "../../../../../car/_features/odometer/model/dao/OdometerUnitDao.ts";
import { ExpenseTypeDao } from "../../../../model/dao/ExpenseTypeDao.ts";
import { ServiceItemDao } from "./ServiceItemDao.ts";
import { CarDao } from "../../../../../car/model/dao/CarDao.ts";
import { CursorOptions, CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { FilterCondition, FilterGroup } from "../../../../../../database/paginator/AbstractPaginator.ts";

export class ServiceLogDao extends Dao<ServiceLogTableRow, ServiceLog, ServiceLogMapper> {
    constructor(
        db: Kysely<DatabaseType>,
        expenseDao: ExpenseDao,
        odometerLogDao: OdometerLogDao,
        serviceTypeDao: ServiceTypeDao,
        odometerUnitDao: OdometerUnitDao,
        expenseTypeDao: ExpenseTypeDao,
        serviceItemDao: ServiceItemDao,
        carDao: CarDao
    ) {
        super(
            db,
            SERVICE_LOG_TABLE,
            new ServiceLogMapper(
                expenseDao,
                odometerLogDao,
                serviceTypeDao,
                odometerUnitDao,
                expenseTypeDao,
                serviceItemDao,
                carDao
            )
        );
    }

    async create(formResult: ServiceLogFields): Promise<ServiceLog | null> {
        const { serviceLog, serviceItems, expense, odometerLog } = await this.mapper.formResultToEntities(formResult);

        const insertedServiceLogId = await this.db.transaction().execute(async (trx) => {
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
            .insertInto(SERVICE_LOG_TABLE)
            .values(serviceLog)
            .returning("id")
            .executeTakeFirstOrThrow();

            const serviceItemsArray = Array.from(serviceItems.values());
            if(serviceItemsArray.length >= 1) {
                await trx
                .insertInto(SERVICE_ITEM_TABLE)
                .values(serviceItemsArray)
                .returning("id")
                .execute();
            }

            return result.id;
        });

        return await this.getById(insertedServiceLogId);
    }

    async update(formResult: ServiceLogFields): Promise<ServiceLog | null> {
        const { serviceLog, serviceItems, expense, odometerLog } = await this.mapper.formResultToEntities(formResult);

        const updatedServiceLogId = await this.db.transaction().execute(async (trx) => {
            await trx
            .updateTable(EXPENSE_TABLE)
            .set(expense)
            .where("id", "=", expense.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            const originalServiceLog = await trx
            .selectFrom(SERVICE_LOG_TABLE)
            .select("odometer_log_id")
            .where("id", "=", serviceLog.id)
            .executeTakeFirst();

            if(originalServiceLog?.odometer_log_id && !odometerLog) {
                await trx
                .deleteFrom(ODOMETER_LOG_TABLE)
                .where("id", "=", originalServiceLog.odometer_log_id)
                .returning("id")
                .executeTakeFirstOrThrow();
            } else if(odometerLog) {
                if(originalServiceLog?.odometer_log_id === odometerLog.id) {
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
            .updateTable(SERVICE_LOG_TABLE)
            .set(serviceLog)
            .where("id", "=", serviceLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();


            const originalServiceItems = await trx
            .selectFrom(SERVICE_ITEM_TABLE)
            .select("id")
            .where("service_log_id", "=", serviceLog.id)
            .execute();

            for(const originalServiceItem of originalServiceItems) {
                const newServiceItem = serviceItems.get(originalServiceItem.id);
                if(newServiceItem) { // if service item already exists update
                    await trx
                    .updateTable(SERVICE_ITEM_TABLE)
                    .set(newServiceItem)
                    .where("id", "=", newServiceItem.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();

                    serviceItems.delete(originalServiceItem.id); //remove from new service items
                } else { // if original service item not exists in new service items then remove it
                    await trx
                    .deleteFrom(SERVICE_ITEM_TABLE)
                    .where("id", "=", originalServiceItem.id)
                    .returning("id")
                    .executeTakeFirstOrThrow();
                }
            }

            const serviceItemsArray = Array.from(serviceItems.values());
            if(serviceItemsArray.length >= 1) { // if new elements are left then insert them
                await trx
                .insertInto(SERVICE_ITEM_TABLE)
                .values(serviceItemsArray)
                .returning("id")
                .execute();
            }

            return result.id;
        });

        return await this.getById(updatedServiceLogId);
    }

    async delete(serviceLog: ServiceLog): Promise<string | number> {
        return await this.db.transaction().execute(async (trx) => {
            const result = await trx
            .deleteFrom(SERVICE_LOG_TABLE)
            .where("id", "=", serviceLog.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            await trx
            .deleteFrom(EXPENSE_TABLE)
            .where("id", "=", serviceLog.expense.id)
            .returning("id")
            .executeTakeFirstOrThrow();

            if(!!serviceLog.odometer) {
                await trx
                .deleteFrom(ODOMETER_LOG_TABLE)
                .where("id", "=", serviceLog.odometer.id)
                .returning("id")
                .executeTakeFirstOrThrow();
            }

            await trx
            .deleteFrom(SERVICE_ITEM_TABLE)
            .where("service_log_id", "=", serviceLog.id)
            .execute();

            return result.id;
        });
    }

    paginator(
        cursorOptions: CursorOptions<keyof ServiceLogTableRow & keyof ExpenseTableRow>,
        filterBy?: FilterCondition<ServiceLogTableRow & ExpenseTableRow> | Array<FilterGroup<DatabaseType, ServiceLogTableRow & ExpenseTableRow>>,
        perPage?: number = 10
    ): CursorPaginator<ServiceLogTableRow & ExpenseTableRow, ServiceLog> {
        const query = this.db
        .selectFrom(SERVICE_LOG_TABLE)
        .innerJoin(EXPENSE_TABLE, `${ EXPENSE_TABLE }.id`, `${ SERVICE_LOG_TABLE }.expense_id`)
        .selectAll(SERVICE_LOG_TABLE);

        return new CursorPaginator<ServiceLogTableRow & ExpenseTableRow, ServiceLog>(
            this.db,
            SERVICE_LOG_TABLE,
            cursorOptions,
            {
                baseQuery: query,
                perPage,
                filterBy,
                mapper: this.mapper.toDto.bind(this.mapper)
            }
        );
    }
}