import { z } from "zod";
import { zNumber } from "../../../types/zodTypes.ts";

export const fuelTankSchema = z
.object({
    id: z.string(),
    type: z.string(),
    capacity: zNumber(0, 0),
    value: zNumber(0, 0),
    measurement: z.string()
});

export type FuelTank = z.infer<typeof fuelTankSchema>;