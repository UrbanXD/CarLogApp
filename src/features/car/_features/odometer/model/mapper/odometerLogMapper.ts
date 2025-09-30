import { OdometerLogTableRow, OdometerTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLog, odometerLogSchema } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogFields } from "../../schemas/form/odometerLogForm.ts";
import { OdometerLogType } from "../enums/odometerLogType.ts";
import { OdometerDao } from "../dao/OdometerDao.ts";
import { kilometerToMile } from "../../utils/convertOdometerUnit.ts";
import { OdometerUnit } from "../enums/odometerUnit.ts";

export class OdometerLogMapper {
    private odometerDao: OdometerDao;

    constructor(odometerDao: OdometerDao) {
        this.odometerDao = odometerDao;
    }

    fromOdometerEntityToOdometerLogEntity(odometerRow: OdometerTableRow, createdAt: string): OdometerLogTableRow {
        return {
            id: odometerRow.id,
            car_id: odometerRow.car_id,
            type: OdometerLogType.SIMPLE,
            value: odometerRow.value,
            note: null,
            date: createdAt
        };
    }

    fromFormResultToOdometerLogEntity(formResult: OdometerLogFields): OdometerLogTableRow {
        return {
            id: formResult.id,
            car_id: formResult.carId,
            type: formResult.type,
            value: formResult.value,
            note: formResult.note,
            date: formResult.date
        };
    }

    async toOdometerLogDto(odometerLogRow: OdometerLogTableRow): Promise<OdometerLog> {
        const odometer = await this.odometerDao.getOdometerByCarId(odometerLogRow.car_id);
        return odometerLogSchema.parse({
            id: odometerLogRow.id,
            carId: odometerLogRow.car_id,
            type: odometerLogRow.type,
            value: odometer.unit === OdometerUnit.MILE ? kilometerToMile(odometerLogRow.value) : odometerLogRow.value,
            unit: odometer.unit,
            note: odometerLogRow.note,
            date: odometerLogRow.date
        });
    }

    async atoOdometerLogDtoArray(odometerLogRowArray: Array<OdometerLog>) {
        return (odometerLogRowArray.map(odometerLogRow => this.toOdometerLogDto(odometerLogRow))).filter(
            element => element !== null);
    }

    toOdometerLogEntity(odometerLog: OdometerLog): OdometerLogTableRow {
        return {
            id: odometerLog.id,
            car_id: odometerLog.carId,
            type: odometerLog.type,
            value: odometerLog.value,
            note: odometerLog.note,
            date: odometerLog.date
        };
    }
}