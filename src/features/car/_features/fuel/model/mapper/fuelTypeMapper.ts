import { FuelTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelType, fuelTypeSchema } from "../../schemas/fuelTypeSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";

export class FuelTypeMapper extends AbstractMapper<FuelTypeTableRow, FuelType> {
    constructor() {
        super();
    }

    async toDto(entity: FuelTypeTableRow): Promise<FuelType> {
        return fuelTypeSchema.parse({
            id: entity.id,
            key: entity.key
        });
    }

    async toEntity(dto: FuelType): Promise<FuelTypeTableRow> {
        return {
            id: dto.id,
            key: dto.key
        };
    }
}