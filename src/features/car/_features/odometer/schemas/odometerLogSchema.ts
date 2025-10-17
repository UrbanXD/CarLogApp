import { z } from "zod";
import { odometerUnitSchema } from "./odometerUnitSchema.ts";
import { odometerLogTypeSchema } from "./odometerLogTypeSchema.ts";

export const odometerLogSchema = z
.object({
    id: z.string().uuid(),
    carId: z.string().uuid(),
    relatedId: z.string().uuid().nullable().optional(),
    type: odometerLogTypeSchema,
    valueInKm: z.number().min(0),
    value: z.number().min(0),
    unit: odometerUnitSchema,
    note: z.string().nullable(),
    date: z.string()
});

export type OdometerLog = z.infer<typeof odometerLogSchema>;