import { z } from "zod";
import { fuelTypeSchema } from "./fuelTypeSchema.ts";
import { fuelUnitSchema } from "./fuelUnitSchema.ts";

export const fuelTankSchema = z
.object({
    id: z.string().uuid(),
    type: fuelTypeSchema,
    unit: fuelUnitSchema,
    capacity: z.number().min(0)
});

export type FuelTank = z.infer<typeof fuelTankSchema>;