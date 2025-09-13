import { z } from "zod";

export const odometerLogSchema = z
.object({
    id: z.string().uuid(),
    car_id: z.string().uuid(),
    value: z.number().min(0),
    unit: z.string(), //convert to enum
    note: z.string().nullable(),
    date: z.string()
});

export type OdometerLog = z.infer<typeof odometerLogSchema>;