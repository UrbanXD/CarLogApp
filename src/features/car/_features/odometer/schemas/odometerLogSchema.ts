import { z } from "zod";
import { OdometerLogType } from "../model/enums/odometerLogType.ts";
import { OdometerUnit } from "../model/enums/odometerUnit.ts";

export const odometerLogSchema = z
.object({
    id: z.string().uuid(),
    carId: z.string().uuid(),
    type: z.enum(Object.keys(OdometerLogType)),
    value: z.number().min(0),
    unit: z.enum(Object.keys(OdometerUnit)),
    note: z.string().nullable(),
    date: z.string()
});

export type OdometerLog = z.infer<typeof odometerLogSchema>;