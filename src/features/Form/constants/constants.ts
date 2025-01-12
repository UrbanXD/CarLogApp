import {InputPickerDataType} from "../components/Input/picker/InputPicker";
import {UseFormReturn} from "react-hook-form";
import {ReactNode} from "react";

export interface UseCustomFormProps extends Partial<UseFormReturn<any>>{
    steps: Array<() => ReactNode>
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