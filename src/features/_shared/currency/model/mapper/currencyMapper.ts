import { AbstractMapper } from "../../../../../database/dao/AbstractMapper.ts";
import { CurrencyTableRow } from "../../../../../database/connector/powersync/AppSchema.ts";
import { Currency, currencySchema } from "../../schemas/currencySchema.ts";
import { PickerItemType } from "../../../../../components/Input/picker/PickerItem.tsx";

export class CurrencyMapper extends AbstractMapper<CurrencyTableRow, Currency> {
    constructor() {
        super();
    }

    async toDto(entity: CurrencyTableRow): Promise<Currency> {
        return currencySchema.parse({
            id: entity.id,
            key: entity.key,
            symbol: entity.symbol
        });
    }

    async toEntity(dto: Currency): Promise<CurrencyTableRow> {
        return {
            id: dto.id,
            key: dto.key,
            symbol: dto.symbol
        };
    }

    dtoToPicker(dtos: Array<Currency>): Promise<Array<PickerItemType>> {
        return dtos.map(dto => ({
            value: dto.id.toString(),
            controllerTitle: dto.symbol,
            title: `${ dto.key } - ${ dto.symbol }`
        }));
    }
}