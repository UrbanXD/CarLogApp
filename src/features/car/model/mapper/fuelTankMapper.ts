import { FuelTankTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { FuelTank, fuelTankSchema } from "../../schemas/fuelTankSchema.ts";

export class FuelTankMapper {
    constructor() {}

    toFuelTankDto(fuelTankRow: FuelTankTableRow): FuelTank {
        return fuelTankSchema.parse({
            id: fuelTankRow.id,
            type: fuelTankRow.type,
            capacity: fuelTankRow.capacity,
            value: fuelTankRow.value,
            measurement: fuelTankRow.measurement
        });
    }

    toFuelTankEntity(fuelTank: FuelTank): FuelTankTableRow {
        return {
            id: fuelTank.id,
            type: fuelTank.type,
            capacity: fuelTank.capacity,
            value: fuelTank.value,
            measurement: fuelTank.measurement
        };
    }
}