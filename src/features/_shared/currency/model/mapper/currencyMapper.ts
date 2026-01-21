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

    dtoToPicker({ dtos, getControllerTitle, getTitle }: {
        dtos: Array<Currency>,
        getControllerTitle?: (dto: Currency) => string,
        getTitle?: (dto: Currency) => string
    }): Array<PickerItemType> {
        return dtos.map(dto => {
            return ({
                value: dto.id.toString(),
                controllerTitle: getControllerTitle?.(dto) ?? dto.symbol,
                title: getTitle?.(dto) ?? getControllerTitle?.(dto) ?? dto.symbol
            });
        });
    }
}