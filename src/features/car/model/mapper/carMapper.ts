import {
    CarTableRow,
    FuelTankTableRow,
    OdometerChangeLogTableRow,
    OdometerLogTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { Car, carSchema } from "../../schemas/carSchema.ts";
import { CarFormFields } from "../../schemas/form/carForm.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import {
    convertOdometerValueFromKilometer,
    convertOdometerValueToKilometer
} from "../../_features/odometer/utils/convertOdometerUnit.ts";
import { OdometerLogTypeEnum } from "../../_features/odometer/model/enums/odometerLogTypeEnum.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { SelectCarModelTableRow, SelectCarTableRow } from "../dao/CarDao.ts";
import { carModelSchema } from "../../schemas/carModelSchema.ts";
import { makeSchema } from "../../schemas/makeSchema.ts";
import { odometerSchema } from "../../_features/odometer/schemas/odometerSchema.ts";
import { odometerUnitSchema } from "../../_features/odometer/schemas/odometerUnitSchema.ts";
import { currencySchema } from "../../../_shared/currency/schemas/currencySchema.ts";
import { fuelTankSchema } from "../../_features/fuel/schemas/fuelTankSchema.ts";
import { fuelTypeSchema } from "../../_features/fuel/schemas/fuelTypeSchema.ts";
import { fuelUnitSchema } from "../../_features/fuel/schemas/fuelUnitSchema.ts";
import { OdometerUnitDao } from "../../_features/odometer/model/dao/OdometerUnitDao.ts";

export class CarMapper extends AbstractMapper<CarTableRow, Car, SelectCarTableRow> {
    constructor(
        private readonly attachmentQueue: PhotoAttachmentQueue | undefined,
        private readonly odometerUnitDao: OdometerUnitDao
    ) {
        super();
    }

    toDto(entity: SelectCarTableRow): Car {
        return carSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            name: entity.name,
            model: carModelSchema.parse({
                id: entity.model_id,
                name: entity.model_name,
                make: makeSchema.parse({
                    id: entity.make_id,
                    name: entity.make_name
                }),
                year: entity.model_year
            }),
            odometer: odometerSchema.parse({
                id: entity.odometer_log_id,
                carId: entity.id,
                valueInKm: entity.odometer_log_value,
                value: convertOdometerValueFromKilometer(
                    entity.odometer_log_value!,
                    entity.odometer_unit_conversion_factor!
                ),
                unit: odometerUnitSchema.parse({
                    id: entity.odometer_unit_id,
                    key: entity.odometer_unit_key,
                    short: entity.odometer_unit_short,
                    conversionFactor: entity.odometer_unit_conversion_factor
                })
            }),
            currency: currencySchema.parse({
                id: entity.currency_id,
                key: entity.currency_key,
                symbol: entity.currency_symbol
            }),
            fuelTank: fuelTankSchema.parse({
                id: entity.fuel_tank_id,
                type: fuelTypeSchema.parse({
                    id: entity.fuel_type_id,
                    key: entity.fuel_type_key
                }),
                unit: fuelUnitSchema.parse({
                    id: entity.fuel_unit_id,
                    key: entity.fuel_unit_key,
                    short: entity.fuel_unit_short,
                    conversionFactor: entity.fuel_unit_conversion_factor
                }),
                capacity: (entity.fuel_tank_capacity != null && entity.fuel_tank_capacity > 0)
                          ? entity.fuel_tank_capacity
                          : 0
            }),
            imagePath: entity.image_url,
            createdAt: entity.created_at
        });
    }

    toEntity(dto: Car): CarTableRow {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            name: dto.name,
            odometer_unit_id: dto.odometer.unit.id,
            currency_id: dto.currency.id,
            model_id: dto.model.id,
            model_year: dto.model.year,
            created_at: dto.createdAt,
            image_url: dto.imagePath ?? null
        };
    }

    toPickerItem(entity: SelectCarModelTableRow): PickerItemType {
        return {
            value: entity.id.toString(),
            title: entity.name,
            subtitle: `${ entity.make_name } ${ entity.model_name }`
        };
    }

    async formResultToCarEntities(
        request: CarFormFields,
        previousCarImagePath?: string | null,
        createdAt?: string
    ): Promise<{
        car: CarTableRow
        odometerLog: OdometerLogTableRow
        odometerChangeLog: OdometerChangeLogTableRow | null,
        fuelTank: FuelTankTableRow
    }> {
        const odometerUnit = (await this.odometerUnitDao.getById(request.odometer.unitId))!;

        let path = request?.image?.fileName ?? null;

        if(this.attachmentQueue) {
            path = await this.attachmentQueue.changeEntityAttachment(
                request.image ?? null,
                previousCarImagePath ?? null,
                request.ownerId
            );
        }

        const car: CarTableRow = {
            id: request.id,
            owner_id: request.ownerId,
            name: request.name,
            odometer_unit_id: request.odometer.unitId,
            currency_id: request.currencyId,
            model_id: request.model.id,
            model_year: request.model.year,
            image_url: path ?? null,
            created_at: createdAt ?? request.createdAt
        };

        const odometerLog: OdometerLogTableRow = {
            id: request.odometer.id,
            car_id: request.id,
            type_id: OdometerLogTypeEnum.SIMPLE,
            value: convertOdometerValueToKilometer(request.odometer.value, odometerUnit?.conversionFactor)
        };

        let odometerChangeLog: OdometerChangeLogTableRow | null = null;
        if(request.odometer.odometerChangeLogId) {
            odometerChangeLog = {
                id: request.odometer.odometerChangeLogId,
                car_id: request.id,
                odometer_log_id: odometerLog.id,
                note: null,
                date: createdAt ?? car.created_at
            };
        }

        const fuelTank: FuelTankTableRow = {
            id: request.fuelTank.id,
            car_id: request.id,
            type_id: request.fuelTank.typeId,
            unit_id: request.fuelTank.unitId,
            capacity: request.fuelTank.capacity
        };

        return { car, odometerLog, odometerChangeLog: odometerChangeLog, fuelTank };
    }

    dtoToPicker(dtos: Array<Car>): Array<PickerItemType> {
        return dtos.map(dto => ({
            value: dto.id,
            title: dto.name,
            subtitle: `${ dto.model.make.name } ${ dto.model.name }`
        }));
    }
}