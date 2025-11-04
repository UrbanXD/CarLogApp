import { z } from "zod";

export const fuelTypeSchema = z
.object({
    id: z.coerce.number(),
    key: z.string(),
    locale: z.string()
});

export type FuelType = z.infer<typeof fuelTypeSchema>;