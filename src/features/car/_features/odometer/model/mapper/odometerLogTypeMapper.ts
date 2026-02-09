import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { OdometerLogTypeTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLogType, odometerLogTypeSchema } from "../../schemas/odometerLogTypeSchema.ts";
import { OdometerLogTypeEnum } from "../enums/odometerLogTypeEnum.ts";
import { COLORS, ICON_NAMES } from "../../../../../../constants";

export class OdometerLogTypeMapper extends AbstractMapper<OdometerLogTypeTableRow, OdometerLogType> {
    constructor() {
        super();
    }

    toDto(entity: OdometerLogTypeTableRow): OdometerLogType {
        let icon = null;
        let primaryColor = COLORS.gray2;
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

    toEntity(dto: OdometerLogType): OdometerLogTypeTableRow {
        return {
            id: dto.id as never,
            key: dto.key
        };
    }
}