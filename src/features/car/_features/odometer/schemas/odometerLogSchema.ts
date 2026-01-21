import { z } from "zod";
import { odometerUnitSchema } from "./odometerUnitSchema.ts";
import { odometerLogTypeSchema } from "./odometerLogTypeSchema.ts";
import { zNote } from "../../../../../types/zodTypes.ts";
import { carNameAndModelSchema } from "../../../schemas/carSchema.ts";

export const odometerLogSchema = z
.object({
    id: z.string().uuid(),
    car: carNameAndModelSchema,
    relatedId: z.string().uuid().nullable().optional(),
    type: odometerLogTypeSchema,
    valueInKm: z.number().min(0),
    value: z.number().min(0),
    unit: odometerUnitSchema,
    note: zNote(),
    date: z.string()
});

export type OdometerLog = z.infer<typeof odometerLogSchema>;