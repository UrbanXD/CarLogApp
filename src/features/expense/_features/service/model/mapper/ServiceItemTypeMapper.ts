import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { ServiceItemTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceItemType, serviceItemTypeSchema } from "../../schemas/serviceItemTypeSchema.ts";

export class ServiceItemTypeMapper extends AbstractMapper<ServiceItemTypeTableRow, ServiceItemType> {
    async toDto(entity: ServiceItemTypeTableRow): Promise<ServiceItemType> {
        return serviceItemTypeSchema.parse({
            id: entity.id,
            key: entity.key,
            ownerId: entity.owner_id
        });
    }

    async toEntity(dto: ServiceItemType): Promise<ServiceItemTypeTableRow> {
        return {
            id: dto.id,
            key: dto.key,
            owner_id: dto.ownerId
        };
    }
}