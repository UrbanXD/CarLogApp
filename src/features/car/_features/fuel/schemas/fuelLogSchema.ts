import { z } from "zod";
import { fuelUnitSchema } from "./fuelUnitSchema.ts";
import { odometerSchema } from "../../odometer/schemas/odometerSchema.ts";

export const fuelLogSchema = z
.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    expenseId: z.string().uuid(),
    fuelUnit: fuelUnitSchema,
    odometer: odometerSchema.nullable(),
    quantity: z.number().min(0),
    originalPricePerUnit: z.number().min(0),
    pricePerUnit: z.number().min(0)
});

export type FuelLog = z.infer<typeof fuelLogSchema>;