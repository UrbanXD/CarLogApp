import { OdometerLog, odometerLogSchema } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogFields } from "../../schemas/form/odometerLogForm.ts";
import { convertOdometerValueFromKilometer, convertOdometerValueToKilometer } from "../../utils/convertOdometerUnit.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { OdometerLogTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerUnitDao } from "../dao/OdometerUnitDao.ts";
import { OdometerLogTypeDao } from "../dao/OdometerLogTypeDao.ts";

export class OdometerLogMapper extends AbstractMapper<OdometerLogTableRow, OdometerLog> {
    private readonly odometerUnitDao: OdometerUnitDao;
    private readonly odometerLogTypeDao: OdometerLogTypeDao;

    constructor(odometerUnitDao: OdometerUnitDao, odometerLogTypeDao: OdometerLogTypeDao) {
        super();
        this.odometerUnitDao = odometerUnitDao;
        this.odometerLogTypeDao = odometerLogTypeDao;
    }

    async toDto(entity: OdometerLogTableRow): Promise<OdometerLog> {
        const odometerUnit = await this.odometerUnitDao.getUnitByCarId(entity.car_id);
        const odometerLogType = await this.odometerLogTypeDao.getById(entity.type_id);

        return odometerLogSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            type: odometerLogType,
            valueInKm: entity.value,
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
            type_id: dto.type.id,
            value: dto.valueInKm,
            note: dto.note,
            date: dto.date
        };
    }

    formResultToEntity(formResult: OdometerLogFields): OdometerLogTableRow {
        return {
            id: formResult.id,
            car_id: formResult.carId,
            type_id: formResult.typeId,
            value: convertOdometerValueToKilometer(formResult.value, formResult.conversionFactor),
            note: formResult.note,
            date: formResult.date
        };
    }
}