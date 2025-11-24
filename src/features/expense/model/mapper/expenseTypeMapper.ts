import { ExpenseTypeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseType, expenseTypeSchema } from "../../schemas/expenseTypeSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { ExpenseTypeEnum } from "../enums/ExpenseTypeEnum.ts";
import { COLORS, ICON_NAMES } from "../../../../constants/index.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";

export class ExpenseTypeMapper extends AbstractMapper<ExpenseTypeTableRow, ExpenseType> {
    constructor() {
        super();
    }

    async toDto(entity: ExpenseTypeTableRow): Promise<ExpenseType> {
        let icon = null;
        let primaryColor = null;
        let secondaryColor = null;

        switch(entity.key) {
            case ExpenseTypeEnum.FUEL:
                icon = ICON_NAMES.fuelPump;
                primaryColor = COLORS.fuelYellow;
                break;
            case ExpenseTypeEnum.SERVICE:
                icon = ICON_NAMES.service;
                primaryColor = COLORS.service;
                break;
            case ExpenseTypeEnum.VEHICLE_INSPECTION:
                icon = ICON_NAMES.vehicleInspection;
                primaryColor = COLORS.vehicleInspection;
                break;
            case ExpenseTypeEnum.WASH:
                icon = ICON_NAMES.carWash;
                primaryColor = COLORS.wash;
                break;
            case ExpenseTypeEnum.TOLL:
                icon = ICON_NAMES.road;
                primaryColor = COLORS.toll;
                break;
            case ExpenseTypeEnum.PARKING:
                icon = ICON_NAMES.parking;
                primaryColor = COLORS.parking;
                break;
            case ExpenseTypeEnum.INSURANCE:
                icon = ICON_NAMES.insurance;
                primaryColor = COLORS.insurance;
                break;
            case ExpenseTypeEnum.REGISTRATION:
                icon = ICON_NAMES.registration;
                primaryColor = COLORS.registration;
                break;
        }

        return expenseTypeSchema.parse({
            id: entity.id,
            key: entity.key,
            ownerId: entity.owner_id,
            icon: icon,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor
        });
    }

    async toEntity(dto: ExpenseType): Promise<ExpenseTypeTableRow> {
        return {
            id: dto.id,
            key: dto.key,
            owner_id: dto.ownerId
        };
    }

    dtoToPicker({ dtos, getTitle }: {
        dtos: Array<ExpenseType>,
        getTitle?: (dto: ExpenseType) => string
    }): Array<PickerItemType> {
        return dtos.map(dto => ({
            value: dto.id.toString(),
            title: getTitle?.(dto) ?? dto.key
        }));
    }
}