import { OdometerLog, odometerLogSchema } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogFields } from "../../schemas/form/odometerLogForm.ts";
import { convertOdometerValueFromKilometer, convertOdometerValueToKilometer } from "../../utils/convertOdometerUnit.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { OdometerLogTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerUnitDao } from "../dao/OdometerUnitDao.ts";

export class OdometerLogMapper extends AbstractMapper<OdometerLogTableRow, OdometerLog> {
    private readonly odometerUnitDao: OdometerUnitDao;

    constructor(odometerUnitDao: OdometerUnitDao) {
        super();
        this.odometerUnitDao = odometerUnitDao;
    }

    async toDto(entity: OdometerLogTableRow): Promise<OdometerLog> {
        const odometerUnit = await this.odometerUnitDao.getUnitByCarId(entity.car_id);

        return odometerLogSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            type: entity.type,
            value: convertOdometerValueFromKilometer(entity.value, odometerUnit.conversionFactor),
            unit: odometerUnit,
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