import {ImageType} from "../../utils/pickImage";
import {z} from "zod";
import {zNumber, zPickerRequired} from "../types/zodTypes";
import car from "../../../../app/(edit)/car";
import {ODOMETER_MEASUREMENTS} from "../constants";
import {zodResolver} from "@hookform/resolvers/zod";

export const CAR_FORM_STEPS_FIELD = [
    ["name"],
    ["brand", "model"],
    ["odometerValue", "odometerMeasurement"],
    ["fuelType", "fuelMeasurement", "fuelTankSize"],
    ["image"]
];
export const CAR_FORM_STEPS_TITLE = [
    "Elnevezés",
    "Modell",
    "Kilométeróra",
    "Üzemanyag",
    "Kép"
];


export interface CarFormFieldType {
    name: string
    brand: string
    model: string
    odometerMeasurement: string
    odometerValue: number
    fuelType: string
    fuelMeasurement: string
    fuelTankSize: number
    image?: ImageType | null
}

export const carFormSchema = z
    .object({
        name: z.string().min(2, "2 karakter legyen min").max(20, "20 karakter legyen max"),
        brand: zPickerRequired,
        model: zPickerRequired,
        odometerMeasurement: zPickerRequired,
        odometerValue: zNumber,
        fuelType: zPickerRequired,
        fuelMeasurement: zPickerRequired,
        fuelTankSize: zNumber,
        image: z.any(),
    });

export const useCarFormProps = (car?: CarFormFieldType) => {
    return {
        defaultValues: {
            name: car?.name || "",
            brand: car?.brand || "",
            model: car?.model || "",
            odometerMeasurement: car?.odometerMeasurement || ODOMETER_MEASUREMENTS[0].title,
            odometerValue: car?.odometerValue || NaN,
            fuelType: car?.fuelType || "",
            fuelMeasurement: car?.fuelMeasurement || "",
            fuelTankSize: car?.fuelTankSize || NaN,
            image: car?.image || null,
        },
        resolver: zodResolver(carFormSchema)
    }
}