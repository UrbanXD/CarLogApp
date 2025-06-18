import { InputPickerDataType } from "../../../components/Input/picker/InputPicker.tsx";
import { UseFormReturn } from "react-hook-form";
import { RenderComponent } from "../../../types/index.ts";

export interface UseCustomFormProps extends Partial<UseFormReturn<any>>{
    steps: Array<RenderComponent>
    submitHandler: () => Promise<void>
}

export const ODOMETER_MEASUREMENTS: Array<InputPickerDataType> = [
    { title: "Kilóméter (km)", value: "km" },
    { title: "ascdvsvxfbvbbr", value: "a" },
    { title: "Mérföld (m)", value: "mile" }
];

export const FUEL_TYPES: Array<InputPickerDataType> = [
    { title: "Dízel" },
    { title: "Benzin" },
    { title: "Elektromos" },
    { title: "LPG" },
];

export const FUEL_MEASUREMENTS: Array<InputPickerDataType> = [
    { title: "Liter", value: "l" },
    { title: "Gallon", value: "gal" }
];