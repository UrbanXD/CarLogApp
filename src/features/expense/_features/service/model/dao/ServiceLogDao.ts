import { Dao } from "../../../../../../database/dao/Dao.ts";
import {
    DatabaseType,
    ServiceLogTableRow,
    ServiceTypeTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceLog } from "../../schemas/serviceLogSchema.ts";
import { ServiceLogMapper } from "../mapper/ServiceLogMapper.ts";
import { ExpenseDao } from "../../../../model/dao/ExpenseDao.ts";
import {
    OdometerLogDao,
    SelectOdometerTableRow
} from "../../../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { ServiceTypeDao } from "./ServiceTypeDao.ts";
import { SERVICE_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/serviceLog.ts";
import { Kysely, sql } from "@powersync/kysely-driver";
import { ServiceLogFormFields } from "../../schemas/form/serviceLogForm.ts";
import { EXPENSE_TABLE } from "../../../../../../database/connector/powersync/tables/expense.ts";
import { ODOMETER_LOG_TABLE } from "../../../../../../database/connector/powersync/tables/odometerLog.ts";
import { SERVICE_ITEM_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItem.ts";
import { OdometerUnitDao } from "../../../../../car/_features/odometer/model/dao/OdometerUnitDao.ts";
import { ExpenseTypeDao } from "../../../../model/dao/ExpenseTypeDao.ts";
import { SelectServiceItemTableRow, ServiceItemDao } from "./ServiceItemDao.ts";
import { CarDao } from "../../../../../car/model/dao/CarDao.ts";
import { CursorOptions, CursorPaginator } from "../../../../../../database/paginator/CursorPaginator.ts";
import { PaginatorOptions } from "../../../../../../database/paginator/AbstractPaginator.ts";
import { SelectQueryBuilder } from "kysely";
import { SelectExpenseTableRow } from "../../../../model/mapper/expenseMapper.ts";
import { CAR_TABLE } from "../../../../../../database/connector/powersync/tables/car.ts";
import { ODOMETER_UNIT_TABLE } from "../../../../../../database/connector/powersync/tables/odometerUnit.ts";
import { EXPENSE_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/expenseType.ts";
import { CURRENCY_TABLE } from "../../../../../../database/connector/powersync/tables/currency.ts";
import { WithPrefix } from "../../../../../../types";
import { jsonArrayFrom } from "kysely/helpers/sqlite";
import { SERVICE_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/serviceType.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { ServiceItemTotalAmountTableRow } from "../mapper/ServiceItemMapper.ts";
import { SERVICE_ITEM_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItemType.ts";

export type SelectServiceLogTableRow =
    Omit<ServiceLogTableRow, "odometer_log_id">
    & WithPrefix<Omit<ServiceTypeTableRow, "id">, "service_type">
    & WithPrefix<Omit<SelectExpenseTableRow, "related_id" | "car_id" | "id">, "expense">
    & WithPrefix<Omit<SelectOdometerTableRow, "log_car_id">, "odometer">
    & {
    items: Array<SelectServiceItemTableRow>
    totalAmount: Array<ServiceItemTotalAmountTableRow>
};

export class ServiceLogDao extends Dao<ServiceLogTableRow, ServiceLog, ServiceLogMapper, SelectServiceLogTableRow> {
    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
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
            powersync,
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

    selectQuery(id?: any | null): SelectQueryBuilder<DatabaseType, any, SelectServiceLogTableRow> {
        let query = this.db
        .selectFrom(`${ SERVICE_LOG_TABLE } as sl` as const)
        .innerJoin(`${ SERVICE_TYPE_TABLE } as st` as const, "st.id", "sl.service_type_id")
        .innerJoin(`${ EXPENSE_TABLE } as e` as const, "e.id", "sl.expense_id")
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as et` as const, "et.id", "e.type_id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "c.id", "sl.car_id")
        .innerJoin(`${ ODOMETER_LOG_TABLE } as ol` as const, "ol.id", "sl.odometer_log_id")
        .innerJoin(`${ ODOMETER_UNIT_TABLE } as u` as const, "u.id", "c.odometer_unit_id")
        .innerJoin(`${ CURRENCY_TABLE } as cur` as const, "cur.id", "e.currency_id")
        .innerJoin(`${ CURRENCY_TABLE } as ccur` as const, "ccur.id", "c.currency_id")
        .selectAll("sl")
        .select((eb) => [
            "st.key as service_type_key",
            "st.owner_id as service_type_owner_id",
            "e.amount as expense_amount",
            "e.original_amount as expense_original_amount",
            "e.exchange_rate as expense_exchange_rate",
            "e.date as expense_date",
            "e.note as expense_note",
            "et.id as expense_type_id",
            "et.key as expense_type_key",
            "et.owner_id as expense_type_owner_id",
            "cur.id as expense_currency_id",
            "cur.symbol as expense_currency_symbol",
            "cur.key as expense_currency_key",
            "ccur.id as expense_car_currency_id",
            "ccur.symbol as expense_car_currency_symbol",
            "ccur.key as expense_car_currency_key",
            "ol.id as odometer_log_id",
            "ol.value as odometer_log_value",
            "ol.type_id as odometer_log_type_id",
            "u.id as odometer_unit_id",
            "u.key as odometer_unit_key",
            "u.short as odometer_unit_short",
            "u.conversion_factor as odometer_unit_conversion_factor",
            jsonArrayFrom(
                eb
                .selectFrom(`${ SERVICE_ITEM_TABLE } as si` as const)
                .innerJoin(`${ SERVICE_ITEM_TYPE_TABLE } as si_sit` as const, "si_sit.id", "si.service_item_type_id")
                .innerJoin(`${ CAR_TABLE } as si_c` as const, "si_c.id", "si.car_id")
                .innerJoin(`${ CURRENCY_TABLE } as si_curr` as const, "si_curr.id", "si.currency_id")
                .innerJoin(`${ CURRENCY_TABLE } as si_ccurr` as const, "si_ccurr.id", "si_c.currency_id")
                .select([
                    "si.id",
                    "si.car_id",
                    "si.service_log_id",
                    "si.service_item_type_id",
                    "si.exchange_rate",
                    "si.quantity",
                    "si.price_per_unit",
                    "si_sit.owner_id as type_owner_id",
                    "si_sit.key as type_key",
                    "si_ccurr.id as car_currency_id",
                    "si_ccurr.key as car_currency_key",
                    "si_ccurr.symbol as car_currency_symbol",
                    "si_curr.id as currency_id",
                    "si_curr.key as currency_key",
                    "si_curr.symbol as currency_symbol"
                ])
                .whereRef("si.service_log_id", "=", "sl.id")
                .$castTo<SelectServiceItemTableRow>()
            ).as("items"),
            jsonArrayFrom(
                eb.selectFrom(`${ SERVICE_ITEM_TABLE } as si` as const)
                .innerJoin(`${ CURRENCY_TABLE } as si_curr` as const, "si_curr.id", "si.currency_id")
                .innerJoin(`${ CURRENCY_TABLE } as si_ccurr` as const, "si_ccurr.id", "c.currency_id")
                .select([
                    // @formatter:off
                    sql<number>`CAST(SUM(si.price_per_unit * si.quantity) AS FLOAT)`.as("original_amount"),
                    sql<number>`CAST(SUM(si.price_per_unit * si.quantity * si.exchange_rate) AS FLOAT)`.as("amount"),
                    // @formatter:on
                    "si.exchange_rate as exchange_rate",
                    "si_curr.id as currency_id",
                    "si_curr.key as currency_key",
                    "si_curr.symbol as currency_symbol",
                    "si_ccurr.id as car_currency_id",
                    "si_ccurr.key as car_currency_key",
                    "si_ccurr.symbol as car_currency_symbol"
                ])
                .whereRef("si.service_log_id", "=", "sl.id")
                .groupBy(["si.currency_id", "si.exchange_rate", "si_curr.id", "si_ccurr.id"])
            ).as("totalAmount")
        ]);

        if(id) query = query.where("sl.id", "=", id);

        return query;
    }

    async createFromFormResult(formResult: ServiceLogFormFields): Promise<ServiceLogTableRow["id"]> {
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

        return insertedServiceLogId;
    }

    async updateFromFormResult(formResult: ServiceLogFormFields): Promise<ServiceLogTableRow["id"]> {
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

        return updatedServiceLogId;
    }

    async deleteLog(serviceLog: ServiceLog): Promise<string | number> {
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
        cursorOptions: CursorOptions<keyof SelectServiceLogTableRow>,
        filterBy?: PaginatorOptions<SelectServiceLogTableRow>["filterBy"],
        perPage: number = 25
    ): CursorPaginator<SelectServiceLogTableRow, ServiceLog> {
        const query = this.db
        .selectFrom(SERVICE_LOG_TABLE)
        .innerJoin(EXPENSE_TABLE, `${ EXPENSE_TABLE }.id`, `${ SERVICE_LOG_TABLE }.expense_id`)
        .selectAll(SERVICE_LOG_TABLE);

        return new CursorPaginator<SelectServiceLogTableRow, ServiceLog>(
            this.db,
            SERVICE_LOG_TABLE,
            cursorOptions,
            {
                baseQuery: query as SelectQueryBuilder<DatabaseType, any, SelectServiceLogTableRow>,
                perPage,
                filterBy,
                mapper: this.mapper.toDto.bind(this.mapper)
            }
        );
    }
}