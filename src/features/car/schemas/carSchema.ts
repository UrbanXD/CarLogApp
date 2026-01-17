import { z } from "zod";
import { odometerSchema } from "../_features/odometer/schemas/odometerSchema.ts";
import { fuelTankSchema } from "../_features/fuel/schemas/fuelTankSchema.ts";
import { carModelSchema } from "./carModelSchema.ts";
import { currencySchema } from "../../_shared/currency/schemas/currencySchema.ts";

export const carSchema = z
.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    name: z.string().min(1, "error.car_name_required").max(
        24,
        "error.car_name_max_limit;24"
    ),
    model: carModelSchema,
    odometer: odometerSchema,
    currency: currencySchema,
    fuelTank: fuelTankSchema,
    imagePath: z.string().optional().nullable(),
    createdAt: z.string()
});

export type Car = z.infer<typeof carSchema>;