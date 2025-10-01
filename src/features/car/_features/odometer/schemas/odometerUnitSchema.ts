import { z } from "zod";

export const odometerUnitSchema = z
.object({
    id: z.coerce.number(),
    key: z.string(),
    locale: z.string(),
    short: z.string(),
    conversionFactor: z.number() //km to unit
});

export type OdometerUnit = z.infer<typeof odometerUnitSchema>;