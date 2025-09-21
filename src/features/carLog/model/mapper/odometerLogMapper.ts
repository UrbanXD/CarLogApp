import { OdometerLogTableRow, OdometerTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLog, odometerLogSchema } from "../../schemas/odometerLogSchema.ts";
import { OdometerLogFields } from "../../schemas/form/odometerLogForm.ts";
import { OdometerLogType } from "../enums/odometerLogType.ts";

export class OdometerLogMapper {
    constructor() {}

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
            car_id: formResult.car_id,
            type: formResult.type,
            value: formResult.value,
            unit: formResult.unit,
            note: formResult.note,
            date: formResult.date
        };
    }

    toOdometerLogDto(odometerLogRow: OdometerLogTableRow): OdometerLog {
        return odometerLogSchema.parse({
            id: odometerLogRow.id,
            car_id: odometerLogRow.car_id,
            type: odometerLogRow.type,
            value: odometerLogRow.value,
            unit: odometerLogRow.unit,
            note: odometerLogRow.note,
            date: odometerLogRow.date
        });
    }

    toOdometerLogDtoArray(odometerLogRowArray: Array<OdometerLog>) {
        return (odometerLogRowArray.map(odometerLogRow => this.toOdometerLogDto(odometerLogRow))).filter(
            element => element !== null);
    }

    toOdometerLogEntity(odometerLog: OdometerLog): OdometerLogTableRow {
        return {
            id: odometerLog.id,
            car_id: odometerLog.car_id,
            type: odometerLog.type,
            value: odometerLog.value,
            unit: odometerLog.unit,
            note: odometerLog.note,
            date: odometerLog.date
        };
    }
}