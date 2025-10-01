import { OdometerLog, odometerLogSchema } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogFields } from "../../schemas/form/odometerLogForm.ts";
import { OdometerLogType } from "../enums/odometerLogType.ts";
import { OdometerDao } from "../dao/OdometerDao.ts";
import { convertOdometerValueFromKilometer, convertOdometerValueToKilometer } from "../../utils/convertOdometerUnit.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { OdometerLogTableRow, OdometerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";

export class OdometerLogMapper extends AbstractMapper<OdometerLogTableRow, OdometerLog> {
    private odometerDao: OdometerDao;

    constructor(odometerDao: OdometerDao) {
        super();
        this.odometerDao = odometerDao;
    }

    async toDto(entity: OdometerLogTableRow): Promise<OdometerLog> {
        const odometer = await this.odometerDao.getByCarId(entity.car_id);

        return odometerLogSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            type: entity.type,
            value: convertOdometerValueFromKilometer(entity.value, odometer.unit.conversionFactor),
            unit: odometer.unit,
            note: entity.note,
            date: entity.date
        });
    }

    async toEntity(dto: OdometerLog): Promise<OdometerLogTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
            type: dto.type,
            value: dto.value,
            note: dto.note,
            date: dto.date
        };
    }

    odometerEntityToEntity(odometerRow: OdometerTableRow, createdAt: string): OdometerLogTableRow {
        return {
            id: odometerRow.id,
            car_id: odometerRow.car_id,
            type: OdometerLogType.SIMPLE,
            value: odometerRow.value,
            note: null,
            date: createdAt
        };
    }

    formResultToEntity(formResult: OdometerLogFields): OdometerLogTableRow {
        return {
            id: formResult.id,
            car_id: formResult.carId,
            type: formResult.type,
            value: convertOdometerValueToKilometer(formResult.value, formResult.conversionFactor),
            note: formResult.note,
            date: formResult.date
        };
    }
}