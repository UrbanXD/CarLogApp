import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { FuelUnitTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelUnit, fuelUnitSchema } from "../../schemas/fuelUnitSchema.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";

export class FuelUnitMapper extends AbstractMapper<FuelUnitTableRow, FuelUnit> {
    constructor() {
        super();
    }

    async toDto(entity: FuelUnitTableRow): Promise<FuelUnit> {
        return fuelUnitSchema.parse({
            id: entity.id,
            key: entity.key,
            locale: "TODO-FUEL_UNIT-LOCALE",
            short: entity.short,
            conversionFactor: entity.conversion_factor
        });
    }

    async toEntity(dto: FuelUnit): Promise<FuelUnitTableRow> {
        return {
            id: dto.id,
            key: dto.key,
            short: dto.short,
            conversion_factor: dto.conversionFactor
        };
    }

    dtoToPicker(dtos: Array<FuelUnit>): Promise<PickerItemType> {
        return dtos.map(dto => ({
            value: dto.id.toString(),
            title: `${ dto.locale } (${ dto.short })`
        }));
    }
}