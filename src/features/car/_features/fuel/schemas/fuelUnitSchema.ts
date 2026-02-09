import { z } from "zod";

export const fuelUnitSchema = z
.object({
    id: z.coerce.number(),
    key: z.string(),
    short: z.string(),
    conversionFactor: z.number() //to liter
});

export type FuelUnit = z.infer<typeof fuelUnitSchema>;