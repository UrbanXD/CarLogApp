import { OdometerLog, odometerLogSchema } from "../../schemas/odometerLogSchema.ts";
import { OdometerChangeLogFormFields } from "../../schemas/form/odometerChangeLogForm.ts";
import { convertOdometerValueFromKilometer, convertOdometerValueToKilometer } from "../../utils/convertOdometerUnit.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import {
    OdometerChangeLogTableRow,
    OdometerLogTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLogTypeDao } from "../dao/OdometerLogTypeDao.ts";
import { Odometer, odometerSchema } from "../../schemas/odometerSchema.ts";
import {
    OdometerLimit,
    SelectOdometerLimitTableRow,
    SelectOdometerLogTableRow,
    SelectOdometerTableRow
} from "../dao/OdometerLogDao.ts";

export class OdometerLogMapper extends AbstractMapper<OdometerLogTableRow, OdometerLog> {
    private readonly odometerLogTypeDao: OdometerLogTypeDao;

    constructor(odometerLogTypeDao: OdometerLogTypeDao) {
        super();
        this.odometerLogTypeDao = odometerLogTypeDao;
    }

    toDto(entity: SelectOdometerLogTableRow): OdometerLog {
        const car = {
            id: entity.car_id,
            name: entity.car_name,
            model: {
                id: entity.car_model_id,
                name: entity.car_model_name,
                year: entity.car_model_year,
                make: {
                    id: entity.car_make_id,
                    name: entity.car_make_name
                }
            }
        };

        const odometerLogType = this.odometerLogTypeDao.mapper.toDto({
            id: entity.type_id as never,
            key: entity.type_key
        });

        return odometerLogSchema.parse({
            id: entity.id,
            car: car,
            relatedId: entity.related_id,
            type: odometerLogType,
            valueInKm: entity.value!,
            value: convertOdometerValueFromKilometer(entity.value!, entity.unit_conversion_factor ?? 1),
            unit: {
                id: entity.unit_id,
                key: entity.unit_key,
                short: entity.unit_short,
                conversionFactor: entity.unit_conversion_factor
            },
            note: entity.note,
            date: entity.date
        });
    }

    toOdometerDto(entity: SelectOdometerTableRow): Odometer {
        return odometerSchema.parse({
            id: entity.log_id,
            carId: entity.log_car_id,
            valueInKm: entity.log_value,
            value: convertOdometerValueFromKilometer(entity.log_value!, entity.unit_conversion_factor ?? 1),
            unit: {
                id: entity.unit_id,
                key: entity.unit_key,
                short: entity.unit_short,
                conversionFactor: entity.unit_conversion_factor
            }
        });
    }

    toOdometerLimitDto(entity: SelectOdometerLimitTableRow): OdometerLimit {
        return {
            min: entity?.min_value ? { value: Number(entity.min_value), date: String(entity.min_date) } : null,
            max: entity?.max_value ? { value: Number(entity.max_value), date: String(entity.max_date) } : null,
            unitText: entity?.unit ?? ""
        };
    }

    toEntity(dto: OdometerLog): OdometerLogTableRow {
        return {
            id: dto.id,
            car_id: dto.car.id,
            type_id: dto.type.id,
            value: dto.valueInKm
        };
    }

    formResultToEntity(formResult: OdometerChangeLogFormFields): {
        odometerLog: Partial<OdometerLogTableRow> & Pick<OdometerLogTableRow, "id">,
        odometerChangeLog: Partial<OdometerChangeLogTableRow> & Pick<OdometerChangeLogTableRow, "id">
    } {
        return {
            odometerLog: {
                id: formResult.id,
                car_id: formResult.carId,
                value: convertOdometerValueToKilometer(formResult.value, formResult.conversionFactor)
            },

            odometerChangeLog: {
                id: formResult.odometerChangeLogId,
                odometer_log_id: formResult.id,
                car_id: formResult.carId,
                note: formResult.note,
                date: formResult.date
            }
        };
    }
}