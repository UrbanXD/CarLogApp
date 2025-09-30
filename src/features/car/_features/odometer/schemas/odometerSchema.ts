import { z } from "zod";
import { OdometerUnit } from "../model/enums/odometerUnit.ts";

export const odometerSchema = z
.object({
    id: z.string().uuid(),
    value: z.number().min(0),
    unit: z.enum(Object.keys(OdometerUnit))
});

export type Odometer = z.infer<typeof odometerSchema>;