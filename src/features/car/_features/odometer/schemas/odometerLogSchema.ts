import { z } from "zod";
import { odometerUnitSchema } from "./odometerUnitSchema.ts";
import { odometerLogTypeSchema } from "./odometerLogTypeSchema.ts";
import { zNote } from "../../../../../types/zodTypes.ts";
import { carSimpleSchema } from "../../../schemas/carSchema.ts";

export const odometerLogSchema = z
.object({
    id: z.string().uuid(),
    car: carSimpleSchema,
    relatedId: z.string().uuid().nullable().optional(),
    type: odometerLogTypeSchema,
    value: z.number().min(0),
    unit: odometerUnitSchema,
    note: zNote(),
    date: z.string()
});

export type OdometerLog = z.infer<typeof odometerLogSchema>;