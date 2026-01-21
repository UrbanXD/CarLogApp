import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { ServiceTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceType, serviceTypeSchema } from "../../schemas/serviceTypeSchema.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { SERVICE_COLORS, SERVICE_ICONS } from "../../../../../../constants";

export class ServiceTypeMapper extends AbstractMapper<ServiceTypeTableRow, ServiceType> {
    constructor() {
        super();
    }

    toDto(entity: ServiceTypeTableRow): ServiceType {
        const isServiceIconsKey = (key: unknown): key is keyof typeof SERVICE_ICONS => {
            return typeof key === "string" && key in SERVICE_ICONS;
        };

        const isServiceColorsKey = (key: unknown): key is keyof typeof SERVICE_COLORS => {
            return typeof key === "string" && key in SERVICE_COLORS;
        };

        const icon = isServiceIconsKey(entity.key) ? SERVICE_ICONS[entity.key] : null;
        const primaryColor = isServiceColorsKey(entity.key) ? SERVICE_COLORS[entity.key] : SERVICE_COLORS.OTHER;
        const secondaryColor = null;

        return serviceTypeSchema.parse({
            id: entity.id,
            key: entity.key,
            ownerId: entity.owner_id,
            icon: icon,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor
        });
    }

    toEntity(dto: ServiceType): ServiceTypeTableRow {
        return {
            id: dto.id,
            key: dto.key,
            owner_id: dto.ownerId
        };
    }

    entityToPickerItem(
        entity: ServiceTypeTableRow,
        getTitle?: (entity: ServiceTypeTableRow) => string
    ): PickerItemType {
        return {
            value: entity.id.toString(),
            title: getTitle?.(entity) ?? entity.key
        };
    }
}