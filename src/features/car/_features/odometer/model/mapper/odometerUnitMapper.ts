import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { OdometerUnitTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerUnit, odometerUnitSchema } from "../../schemas/odometerUnitSchema.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";

export class OdometerUnitMapper extends AbstractMapper<OdometerUnitTableRow, OdometerUnit> {
    constructor() {
        super();
    }

    async toDto(entity: OdometerUnitTableRow): Promise<OdometerUnit> {
        return odometerUnitSchema.parse({
            id: entity.id,
            key: entity.key,
            short: entity.short,
            conversionFactor: entity.conversion_factor
        });
    }

    async toEntity(dto: OdometerUnit): Promise<OdometerUnitTableRow> {
        return {
            id: dto.id as never,
            key: dto.key,
            short: dto.short,
            conversion_factor: dto.conversionFactor
        };
    }

    dtoToPicker(dtos: Array<OdometerUnit>, getTitle?: (dto: OdometerUnit) => string): Array<PickerItemType> {
        return dtos.map(dto => ({
            value: dto.id.toString(),
            title: getTitle?.(dto) ?? dto.key
        }));
    }
}