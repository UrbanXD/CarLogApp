import { z } from "zod";

export const fuelTankSchema = z
.object({
    id: z.string().uuid(),
    type: z.string(), //convert to enum
    capacity: z.number().min(0),
    value: z.number().min(0),
    measurement: z.string() // convert to enum
});

export type FuelTank = z.infer<typeof fuelTankSchema>;