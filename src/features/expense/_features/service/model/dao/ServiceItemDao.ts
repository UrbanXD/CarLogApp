import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, ServiceItemTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceItem } from "../../schemas/serviceItemSchema.ts";
import { SelectServiceItemTableRow, ServiceItemMapper } from "../mapper/ServiceItemMapper.ts";
import { Kysely, sql } from "@powersync/kysely-driver";
import { SERVICE_ITEM_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItem.ts";
import { ServiceItemTypeDao } from "./ServiceItemTypeDao.ts";
import { CurrencyDao } from "../../../../../_shared/currency/model/dao/CurrencyDao.ts";
import { Amount } from "../../../../../_shared/currency/schemas/amountSchema.ts";
import { CAR_TABLE } from "../../../../../../database/connector/powersync/tables/car.ts";
import { SelectQueryBuilder } from "kysely";

export class ServiceItemDao extends Dao<ServiceItemTableRow, ServiceItem, ServiceItemMapper> {
    constructor(
        db: Kysely<DatabaseType>,
        serviceItemTypeDao: ServiceItemTypeDao,
        currencyDao: CurrencyDao
    ) {
        super(db, SERVICE_ITEM_TABLE, new ServiceItemMapper(serviceItemTypeDao, currencyDao));
    }

    selectQuery(): SelectQueryBuilder<DatabaseType, ServiceItemTableRow> {
        return this.db
        .selectFrom(SERVICE_ITEM_TABLE)
        .innerJoin(CAR_TABLE, `${ CAR_TABLE }.id`, `${ SERVICE_ITEM_TABLE }.car_id`)
        .selectAll(SERVICE_ITEM_TABLE)
        .select(`${ CAR_TABLE }.currency_id as car_currency_id`);
    }

    async getAllByServiceLogId(serviceLogId: string): Array<SelectServiceItemTableRow> {
        const result = await this.selectQuery()
        .where(`${ SERVICE_ITEM_TABLE }.service_log_id`, "=", serviceLogId)
        .execute();

        return await this.mapper.toDtoArray(result);
    }

    async getTotalAmountByServiceLogId(serviceLogId: string): Promise<Array<Amount>> {
        const result1 = await this.db
        .selectFrom(`${ SERVICE_ITEM_TABLE } as si`)
        .innerJoin(`${ CAR_TABLE } as c`, "c.id", "si.car_id")
        .select("c.currency_id as car_currency_id")
        .whereRef("si.service_log_id", "=", serviceLogId)
        .executeTakeFirst();

        if(!result1?.car_currency_id) return [];

        const result2 = await this.db
        .selectFrom(`${ SERVICE_ITEM_TABLE } as si`)
        .select((eb) => [
            "si.service_log_id",
            // @formatter:off
            eb.fn.coalesce(eb.fn.sum(sql<number>`si.price_per_unit * si.quantity`), eb.val(0)).as("total_amount"),
            eb.fn.coalesce(eb.fn.sum(sql<number>`si.price_per_unit * si.quantity * si.exchange_rate`), eb.val(0)).as("exchanged_total_amount"),
            // @fomatter:on
            "si.currency_id",
            "si.exchange_rate"
        ])
        .whereRef("si.service_log_id", "=", serviceLogId)
        .groupBy(["si.service_log_id", "si.currency_id"])
        .orderBy("total_amount", "desc")
        .execute();

        return this.mapper.toTotalAmountArray(result1.car_currency_id, result2);
    }
}