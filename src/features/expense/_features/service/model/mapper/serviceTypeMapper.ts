import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { ServiceTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceType, serviceTypeSchema } from "../../schemas/serviceTypeSchema.ts";
import { ServiceTypeEnum } from "../enums/ServiceTypeEnum.ts";
import { COLORS, ICON_NAMES } from "../../../../../../constants/index.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";

export class ServiceTypeMapper extends AbstractMapper<ServiceTypeTableRow, ServiceType> {
    constructor() {
        super();
    }

    async toDto(entity: ServiceTypeTableRow): Promise<ServiceType> {
        let icon = null;
        let primaryColor = null;
        let secondaryColor = null;

        switch(entity.key) {
            case ServiceTypeEnum.SMALL_SERVICE:
                icon = ICON_NAMES.service;
                primaryColor = COLORS.service;
                secondaryColor = COLORS.service;
                break;
        }

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

    entityToPickerItem(entity: ServiceTypeTableRow): Promise<PickerItemType> {
        return {
            value: entity.id.toString(),
            title: entity.key
        };
    }
}