import { FuelTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelType, fuelTypeSchema } from "../../schemas/fuelTypeSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";

export class FuelTypeMapper extends AbstractMapper<FuelTypeTableRow, FuelType> {
    constructor() {
        super();
    }

    async toDto(entity: FuelTypeTableRow): Promise<FuelType> {
        return fuelTypeSchema.parse({
            id: entity.id,
            key: entity.key,
            locale: entity.key //todo localization
        });
    }

    async toEntity(dto: FuelType): Promise<FuelTypeTableRow> {
        return {
            id: dto.id,
            key: dto.key
        };
    }

    dtoToPicker(dtos: Array<FuelType>): Promise<Array<PickerItemType>> {
        return dtos.map(dto => ({
            value: dto.id.toString(),
            title: dto.locale
        }));
    }
}