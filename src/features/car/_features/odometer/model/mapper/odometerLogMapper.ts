import { OdometerLog, odometerLogSchema } from "../../schemas/odometerLogSchema.ts";
import { OdometerChangeLogFormFields } from "../../schemas/form/odometerChangeLogForm.ts";
import { convertOdometerValueFromKilometer, convertOdometerValueToKilometer } from "../../utils/convertOdometerUnit.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import {
    OdometerChangeLogTableRow,
    OdometerLogTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerUnitDao } from "../dao/OdometerUnitDao.ts";
import { OdometerLogTypeDao } from "../dao/OdometerLogTypeDao.ts";
import { OdometerUnit } from "../../schemas/odometerUnitSchema.ts";
import { OdometerLogType } from "../../schemas/odometerLogTypeSchema.ts";
import { Odometer, odometerSchema } from "../../schemas/odometerSchema.ts";
import { SelectOdometerLogTableRow } from "../dao/OdometerLogDao.ts";

export class OdometerLogMapper extends AbstractMapper<OdometerLogTableRow, OdometerLog> {
    private readonly odometerUnitDao: OdometerUnitDao;
    private readonly odometerLogTypeDao: OdometerLogTypeDao;

    constructor(odometerUnitDao: OdometerUnitDao, odometerLogTypeDao: OdometerLogTypeDao) {
        super();
        this.odometerUnitDao = odometerUnitDao;
        this.odometerLogTypeDao = odometerLogTypeDao;
    }

    async toDto(entity: SelectOdometerLogTableRow): Promise<OdometerLog> {
        const [odometerUnit, odometerLogType]: [OdometerUnit, OdometerLogType | null] = await Promise.all([
            this.odometerUnitDao.getUnitByCarId(entity.car_id!),
            this.odometerLogTypeDao.getById(entity.type_id)
        ]);

        return odometerLogSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            relatedId: entity.related_id,
            type: odometerLogType,
            valueInKm: entity.value!,
            value: convertOdometerValueFromKilometer(entity.value!, odometerUnit.conversionFactor!),
            unit: odometerUnit,
            note: entity.note,
            date: entity.date
        });
    }

    async toOdometerDto(entity: OdometerLogTableRow): Promise<Odometer> {
        const odometerUnit = await this.odometerUnitDao.getUnitByCarId(entity.car_id!);

        return odometerSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            valueInKm: entity.value,
            value: convertOdometerValueFromKilometer(entity.value!, odometerUnit.conversionFactor!),
            unit: odometerUnit
        });
    }

    async toEntity(dto: OdometerLog): Promise<OdometerLogTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
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