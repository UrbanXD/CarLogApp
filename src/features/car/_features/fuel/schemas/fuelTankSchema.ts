import { z } from "zod";
import { FuelUnit } from "../model/enums/fuelUnit.ts";

export const fuelTankSchema = z
.object({
    id: z.string().uuid(),
    type: z.string(), //convert to enum
    capacity: z.number().min(0),
    value: z.number().min(0),
    unit: z.enum(Object.keys(FuelUnit))
});

export type FuelTank = z.infer<typeof fuelTankSchema>;