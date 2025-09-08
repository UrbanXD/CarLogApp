import { z } from "zod";
import { zImage } from "../../../types/zodTypes.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { odometerSchema } from "./odometerSchema.ts";
import { fuelTankSchema } from "./fuelTankSchema.ts";
import { carModelSchema } from "./carModelSchema.ts";

export const carSchema = z
.object({
    id: z.string(),
    ownerId: z.string(),
    name: z.string().min(1, "Adja meg az autó azonosítóját!").max(24, "Az autó azonosítója maximum 24 karakter lehet!"),
    model: carModelSchema,
    odometer: odometerSchema,
    fuelTank: fuelTankSchema,
    image: zImage,
    createdAt: z.string()
});

export type Car = z.infer<typeof carSchema>;

const editCarFormSchema = carSchema.partial();

export type EditCarFormFieldType = z.infer<typeof editCarFormSchema>;

export const useEditCarFormProps = (car?: EditCarFormFieldType) => {
    return {
        defaultValues: car,
        resolver: zodResolver(editCarFormSchema)
    };
};