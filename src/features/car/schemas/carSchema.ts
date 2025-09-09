import { z } from "zod";
import { zImage } from "../../../types/zodTypes.ts";
import { odometerSchema } from "./odometerSchema.ts";
import { fuelTankSchema } from "./fuelTankSchema.ts";
import { carModelSchema } from "./carModelSchema.ts";

export const carSchema = z
.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    name: z.string().min(1, "Kérem adjon meg egy azonosítót az autója számára!").max(
        24,
        "Az autó azonosítója maximum 24 karakter lehet!"
    ),
    model: carModelSchema,
    odometer: odometerSchema,
    fuelTank: fuelTankSchema,
    image: zImage,
    createdAt: z.string()
});

export type Car = z.infer<typeof carSchema>;