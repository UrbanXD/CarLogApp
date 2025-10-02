import { z } from "zod";
import { odometerUnitSchema } from "./odometerUnitSchema.ts";

export const odometerSchema = z
.object({
    value: z.number().min(0),
    unit: odometerUnitSchema
});

export type Odometer = z.infer<typeof odometerSchema>;