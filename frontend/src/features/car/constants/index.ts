import { UseFormReturn } from "react-hook-form";
import { RenderComponent } from "../../../types/index.ts";
import { RawPickerElement } from "../../../utils/toPickerItems.ts";

export interface UseCustomFormProps extends Partial<UseFormReturn<any>> {
    steps: Array<RenderComponent>;
    submitHandler: () => Promise<void>;
}

export const ODOMETER_MEASUREMENTS: Array<RawPickerElement> = [
    { title: "Kilóméter (km)", value: "km" },
    { title: "Mérföld (mi)", value: "mi" }
];

export const FUEL_TYPES: Array<RawPickerElement> = [
    { title: "Dízel" },
    { title: "Benzin" },
    { title: "Elektromos" },
    { title: "LPG" }
];

export const FUEL_MEASUREMENTS: Array<RawPickerElement> = [
    { title: "Liter", value: "l" },
    { title: "Gallon", value: "gal" }
];

export enum CAR_FORM_STEPS {
    NameStep,
    CarModelStep,
    OdometerStep,
    FuelStep,
    ImageStep,
    ResultStep
}