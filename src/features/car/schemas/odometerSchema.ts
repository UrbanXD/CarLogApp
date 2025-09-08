import { z } from "zod";
import { zNumber } from "../../../types/zodTypes.ts";

export const odometerSchema = z
.object({
    id: z.string(),
    value: zNumber(0, 0),
    measurement: z.string()
});

export type Odometer = z.infer<typeof odometerSchema>;