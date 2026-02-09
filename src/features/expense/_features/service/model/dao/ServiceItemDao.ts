import { Dao } from "../../../../../../database/dao/Dao.ts";
import {
    DatabaseType,
    ServiceItemTableRow,
    ServiceItemTypeTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceItem } from "../../schemas/serviceItemSchema.ts";
import { ServiceItemMapper } from "../mapper/ServiceItemMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { SERVICE_ITEM_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItem.ts";
import { ServiceItemTypeDao } from "./ServiceItemTypeDao.ts";
import { CurrencyDao } from "../../../../../_shared/currency/model/dao/CurrencyDao.ts";
import { CAR_TABLE } from "../../../../../../database/connector/powersync/tables/car.ts";
import { SelectQueryBuilder } from "kysely";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { WithPrefix } from "../../../../../../types";
import { SelectAmountCurrencyTableRow } from "../../../../model/mapper/expenseMapper.ts";
import { CURRENCY_TABLE } from "../../../../../../database/connector/powersync/tables/currency.ts";
import { SERVICE_ITEM_TYPE_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItemType.ts";
import { exchangedAmountExpression } from "../../../../../../database/dao/expressions";

export type SelectServiceItemTableRow =
    ServiceItemTableRow &
    WithPrefix<Omit<ServiceItemTypeTableRow, "id">, "type"> &
    SelectAmountCurrencyTableRow &
    { exchanged_price_per_unit: number | null }

export class ServiceItemDao extends Dao<ServiceItemTableRow, ServiceItem, ServiceItemMapper> {
    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        serviceItemTypeDao: ServiceItemTypeDao,
        currencyDao: CurrencyDao
    ) {
        super(db, powersync, SERVICE_ITEM_TABLE, new ServiceItemMapper(serviceItemTypeDao, currencyDao));
    }

    selectQuery(id?: any | null): SelectQueryBuilder<DatabaseType, any, SelectServiceItemTableRow> {
        return this.db
        .selectFrom(`${ SERVICE_ITEM_TABLE } as si` as const)
        .innerJoin(`${ SERVICE_ITEM_TYPE_TABLE } as sit` as const, "sit.id", "si.service_item_type_id")
        .innerJoin(`${ CAR_TABLE } as c` as const, "c.id", "si.car_id")
        .innerJoin(`${ CURRENCY_TABLE } as curr` as const, "curr.id", "si.currency_id")
        .innerJoin(`${ CURRENCY_TABLE } as c_curr` as const, "c_curr.id", "c.currency_id")
        .select((eb) => [
            "si.id",
            "si.service_log_id",
            "si.quantity",
            "si.price_per_unit",
            exchangedAmountExpression(eb, "si.price_per_unit", "si.exchange_rate")
            .as("exchanged_price_per_unit"),
            "si.exchange_rate",
            "sit.id as service_item_type_id",
            "sit.owner_id as type_owner_id",
            "sit.key as type_key",
            "c.id as car_id",
            "c_curr.id as car_currency_id",
            "c_curr.key as car_currency_key",
            "c_curr.symbol as car_currency_symbol",
            "curr.id as currency_id",
            "curr.key as currency_key",
            "curr.symbol as currency_symbol"
        ])
        .$if(!!id, (qb) => qb.where("si.id", "=", id));
    }
}