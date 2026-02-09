import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { ServiceItemTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceItemType, serviceItemTypeSchema } from "../../schemas/serviceItemTypeSchema.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { SERVICE_COLORS, SERVICE_ITEM_COLORS, SERVICE_ITEM_ICONS } from "../../../../../../constants";

export class ServiceItemTypeMapper extends AbstractMapper<ServiceItemTypeTableRow, ServiceItemType> {
    toDto(entity: ServiceItemTypeTableRow): ServiceItemType {
        const isServiceItemIconsKey = (key: unknown): key is keyof typeof SERVICE_ITEM_ICONS => {
            return typeof key === "string" && key in SERVICE_ITEM_ICONS;
        };

        const isServiceItemColorsKey = (key: unknown): key is keyof typeof SERVICE_ITEM_COLORS => {
            return typeof key === "string" && key in SERVICE_ITEM_COLORS;
        };

        const icon = isServiceItemIconsKey(entity.key) ? SERVICE_ITEM_ICONS[entity.key] : null;
        const primaryColor = isServiceItemColorsKey(entity.key)
                             ? SERVICE_ITEM_COLORS[entity.key]
                             : SERVICE_COLORS.OTHER;
        let secondaryColor = null;

        return serviceItemTypeSchema.parse({
            id: entity.id,
            key: entity.key,
            ownerId: entity.owner_id,
            icon: icon,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor
        });
    }

    toEntity(dto: ServiceItemType): ServiceItemTypeTableRow {
        return {
            id: dto.id,
            key: dto.key,
            owner_id: dto.ownerId
        };
    }

    toPickerItem(
        entity: ServiceItemTypeTableRow,
        getTitle?: (entity: ServiceItemTypeTableRow) => string
    ): PickerItemType {
        return {
            value: entity.id.toString(),
            title: getTitle?.(entity) ?? entity.key
        };
    }
}