import { Dao } from "../../../../../database/dao/Dao.ts";
import { CurrencyTableRow, DatabaseType } from "../../../../../database/connector/powersync/AppSchema.ts";
import { Currency } from "../../schemas/currencySchema.ts";
import { CurrencyMapper } from "../mapper/currencyMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { CURRENCY_TABLE } from "../../../../../database/connector/powersync/tables/currency.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { UseInfiniteQueryOptions } from "../../../../../database/hooks/useInfiniteQuery.ts";
import { PickerItemType } from "../../../../../components/Input/picker/PickerItem.tsx";
import { CAR_TABLE } from "../../../../../database/connector/powersync/tables/car.ts";

export class CurrencyDao extends Dao<CurrencyTableRow, Currency, CurrencyMapper> {
    constructor(db: Kysely<DatabaseType>, powersync: AbstractPowerSyncDatabase) {
        super(db, powersync, CURRENCY_TABLE, new CurrencyMapper());
    }

    pickerInfiniteQuery({
        getControllerTitle,
        getTitle
    }: {
        getControllerTitle?: (entity: CurrencyTableRow) => string,
        getTitle?: (entity: CurrencyTableRow) => string
    }): UseInfiniteQueryOptions<ReturnType<CurrencyDao["selectQuery"]>, PickerItemType> {
        return {
            baseQuery: this.selectQuery(),
            defaultCursorOptions: {
                cursor: [
                    { field: "symbol", order: "asc" },
                    { field: "key", order: "asc", toLowerCase: true },
                    { field: "id", order: "asc" }
                ],
                defaultOrder: "asc"
            },
            idField: "id",
            mappedItemId: "value",
            mapper: (entity) => this.mapper.toPickerItem({ entity, getControllerTitle, getTitle })
        };
    }

    async getCarCurrency(carId: string): Promise<Currency | null> {
        const result = await this.db
        .selectFrom(`${ CAR_TABLE } as c` as const)
        .innerJoin(`${ CURRENCY_TABLE } as curr` as const, "curr.id", "c.currency_id")
        .select([
            "curr.id",
            "curr.key",
            "curr.symbol"
        ])
        .where("c.id", "=", carId)
        .executeTakeFirst();

        return result ? this.mapper.toDto(result) : null;
    }
}