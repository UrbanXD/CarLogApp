import { AbstractMapper } from "../../../../../database/dao/AbstractMapper.ts";
import { CurrencyTableRow } from "../../../../../database/connector/powersync/AppSchema.ts";
import { Currency, currencySchema } from "../../schemas/currencySchema.ts";
import { PickerItemType } from "../../../../../components/Input/picker/PickerItem.tsx";

export class CurrencyMapper extends AbstractMapper<CurrencyTableRow, Currency> {
    constructor() {
        super();
    }

    toDto(entity: CurrencyTableRow): Currency {
        return currencySchema.parse({
            id: entity.id,
            key: entity.key,
            symbol: entity.symbol
        });
    }

    toEntity(dto: Currency): CurrencyTableRow {
        return {
            id: dto.id as never,
            key: dto.key,
            symbol: dto.symbol
        };
    }

    toPickerItem({ entity, getControllerTitle, getTitle }: {
        entity: CurrencyTableRow,
        getControllerTitle?: (entity: CurrencyTableRow) => string,
        getTitle?: (entity: CurrencyTableRow) => string
    }): PickerItemType {
        return {
            value: String(entity.id),
            controllerTitle: getControllerTitle?.(entity) ?? entity.symbol,
            title: getTitle?.(entity) ?? getControllerTitle?.(entity) ?? entity.symbol
        };
    }
}