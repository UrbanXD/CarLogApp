import { OdometerTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Odometer, odometerSchema } from "../../schemas/odometerSchema.ts";

export class OdometerMapper {
    constructor() {}

    toOdometerDto(odometerRow: OdometerTableRow): Odometer {
        return odometerSchema.parse({
            id: odometerRow.id,
            value: odometerRow.value,
            measurement: odometerRow.measurement
        });
    }

    toOdometerEntity(odometer: Odometer): OdometerTableRow {
        return {
            id: odometer.id,
            value: odometer.value,
            measurement: odometer.measurement
        };
    }
}