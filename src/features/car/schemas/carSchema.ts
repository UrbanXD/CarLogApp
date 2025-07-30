import { z } from "zod";
import { zImage, zNumber, zPickerRequired } from "../../../types/zodTypes.ts";
import { zodResolver } from "@hookform/resolvers/zod";

const carFormSchema = z
.object({
    name: z.string().min(2, "2 karakter legyen min").max(20, "20 karakter legyen max"),
    brand: zPickerRequired,
    model: zPickerRequired,
    odometerMeasurement: zPickerRequired,
    odometerValue: zNumber(),
    fuelType: zPickerRequired,
    fuelMeasurement: zPickerRequired,
    fuelTankSize: zNumber(),
    fuelValue: zNumber(),
    image: zImage.optional()
});

export type AddCarFormFieldType = z.infer<typeof carFormSchema>;

const editCarFormSchema = carFormSchema.partial();

export type EditCarFormFieldType = z.infer<typeof editCarFormSchema>;

export const useAddCarFormProps = () => {
    const defaultValues: AddCarFormFieldType = {
        name: "",
        brand: "",
        model: "",
        odometerValue: NaN,
        fuelType: "",
        fuelMeasurement: "",
        fuelTankSize: NaN,
        fuelValue: 0,
        image: null
    };

    return {
        defaultValues,
        resolver: zodResolver(carFormSchema)
    };
};

export const useEditCarFormProps = (car?: EditCarFormFieldType) => {
    return {
        defaultValues: car,
        resolver: zodResolver(editCarFormSchema)
    };
};