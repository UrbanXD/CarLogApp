import { z } from "zod";

export const odometerSchema = z
.object({
    id: z.string().uuid(),
    value: z.number().min(0),
    measurement: z.string() //convert to enum
});

export type Odometer = z.infer<typeof odometerSchema>;