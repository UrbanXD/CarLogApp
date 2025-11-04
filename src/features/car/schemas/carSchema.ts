import { z } from "zod";
import { zImage } from "../../../types/zodTypes.ts";
import { odometerSchema } from "../_features/odometer/schemas/odometerSchema.ts";
import { fuelTankSchema } from "../_features/fuel/schemas/fuelTankSchema.ts";
import { carModelSchema } from "./carModelSchema.ts";
import { currencySchema } from "../../_shared/currency/schemas/currencySchema.ts";

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
    currency: currencySchema,
    fuelTank: fuelTankSchema,
    image: zImage,
    createdAt: z.string()
});

export type Car = z.infer<typeof carSchema>;