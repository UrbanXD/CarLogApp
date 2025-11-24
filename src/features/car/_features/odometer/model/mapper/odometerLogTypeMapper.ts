import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { OdometerLogTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLogType, odometerLogTypeSchema } from "../../schemas/odometerLogTypeSchema.ts";
import { OdometerLogTypeEnum } from "../enums/odometerLogTypeEnum.ts";
import { COLORS, ICON_NAMES } from "../../../../../../constants/index.ts";

export class OdometerLogTypeMapper extends AbstractMapper<OdometerLogTypeTableRow, OdometerLogType> {
    constructor() {
        super();
    }

    async toDto(entity: OdometerLogTypeTableRow): Promise<OdometerLogType> {
        let icon = null;
        let primaryColor = null;
        let secondaryColor = null;

        switch(Number(entity.id)) {
            case OdometerLogTypeEnum.FUEL:
                icon = ICON_NAMES.fuelPump;
                primaryColor = COLORS.fuelYellow;
                break;
            case OdometerLogTypeEnum.SERVICE:
                icon = ICON_NAMES.service;
                primaryColor = COLORS.service;
                break;
            case OdometerLogTypeEnum.RIDE:
                icon = ICON_NAMES.road;
                primaryColor = COLORS.ride;
                break;
        }

        return odometerLogTypeSchema.parse({
            id: entity.id,
            key: entity.key,
            icon: icon,
            primaryColor,
            secondaryColor: secondaryColor
        });
    }

    async toEntity(dto: OdometerLogType): Promise<OdometerLogTypeTableRow> {
        return {
            id: dto.id,
            key: dto.key
        };
    }
}