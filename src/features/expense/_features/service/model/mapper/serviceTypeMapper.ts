import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { ServiceTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceType, serviceTypeSchema } from "../../schemas/serviceTypeSchema.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { SERVICE_COLORS, SERVICE_ICONS } from "../../../../../../constants/index.ts";

export class ServiceTypeMapper extends AbstractMapper<ServiceTypeTableRow, ServiceType> {
    constructor() {
        super();
    }

    async toDto(entity: ServiceTypeTableRow): Promise<ServiceType> {
        let icon = SERVICE_ICONS[entity.key] ?? null;
        let primaryColor = SERVICE_COLORS[entity.key] ?? SERVICE_COLORS.OTHER;
        let secondaryColor = null;

        return serviceTypeSchema.parse({
            id: entity.id,
            key: entity.key,
            ownerId: entity.owner_id,
            icon: icon,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor
        });
    }

    async toEntity(dto: ServiceType): Promise<ServiceTypeTableRow> {
        return {
            id: dto.id,
            key: dto.key,
            owner_id: dto.ownerId
        };
    }

    entityToPickerItem(
        entity: ServiceTypeTableRow,
        getTitle?: (entity: ServiceTypeTableRow) => string
    ): Promise<PickerItemType> {
        return {
            value: entity.id.toString(),
            title: getTitle?.(entity) ?? entity.key
        };
    }
}