import { Dao } from "../../../../../database/dao/Dao.ts";
import { CurrencyTableRow, DatabaseType } from "../../../../../database/connector/powersync/AppSchema.ts";
import { Currency } from "../../schemas/currencySchema.ts";
import { CurrencyMapper } from "../mapper/currencyMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { CURRENCY_TABLE } from "../../../../../database/connector/powersync/tables/currency.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";

export class CurrencyDao extends Dao<CurrencyTableRow, Currency, CurrencyMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, CURRENCY_TABLE, new CurrencyMapper());
    }
}