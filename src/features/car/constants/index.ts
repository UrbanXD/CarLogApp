import { RawPickerElement } from "../../../utils/toPickerItems.ts";
import { OdometerUnit } from "../_features/odometer/model/enums/odometerUnit.ts";
import { FuelUnit } from "../_features/fuel/model/enums/fuelUnit.ts";

export const ODOMETER_MEASUREMENTS: Array<RawPickerElement> = [
    { title: "Kilóméter (km)", value: OdometerUnit.KILOMETER },
    { title: "Mérföld (mi)", value: OdometerUnit.MILE }
];

export const FUEL_TYPES: Array<RawPickerElement> = [
    { title: "Dízel" },
    { title: "Benzin" },
    { title: "Elektromos" },
    { title: "LPG" }
];

export const FUEL_MEASUREMENTS: Array<RawPickerElement> = [
    { title: "Liter", value: FuelUnit.LITER },
    { title: "Gallon", value: FuelUnit.GALLON },
    { title: "Köbméter", value: FuelUnit.CUBIC_METER }
];

export enum CAR_FORM_STEPS {
    NameStep,
    CarModelStep,
    OdometerStep,
    FuelStep,
    ImageStep,
    ResultStep
}