import { z } from "zod";
import { odometerUnitSchema } from "./odometerUnitSchema.ts";

export const odometerSchema = z
.object({
    id: z.string().uuid(),
    carId: z.string().uuid(),
    valueInKm: z.number().min(0),
    value: z.number().min(0),
    unit: odometerUnitSchema
});

export type Odometer = z.infer<typeof odometerSchema>;