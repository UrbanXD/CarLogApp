import { FuelTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelType, fuelTypeSchema } from "../../schemas/fuelTypeSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";

export class FuelTypeMapper extends AbstractMapper<FuelTypeTableRow, FuelType> {
    constructor() {
        super();
    }

    toDto(entity: FuelTypeTableRow): FuelType {
        return fuelTypeSchema.parse({
            id: entity.id,
            key: entity.key
        });
    }

    toEntity(dto: FuelType): FuelTypeTableRow {
        return {
            id: dto.id as never,
            key: dto.key
        };
    }

    dtoToPicker(dtos: Array<FuelType>, getTitle?: (dto: FuelType) => string): Array<PickerItemType> {
        return dtos.map(dto => ({
            value: dto.id.toString(),
            title: getTitle?.(dto) ?? dto.key
        }));
    }
}