import { z } from "zod";
import { fuelUnitSchema } from "./fuelUnitSchema.ts";
import { odometerSchema } from "../../odometer/schemas/odometerSchema.ts";
import { expenseSchema } from "../../../../expense/schemas/expenseSchema.ts";

export const fuelLogSchema = z
.object({
    id: z.string().uuid(),
    carId: z.string().uuid(),
    expense: expenseSchema,
    fuelUnit: fuelUnitSchema,
    odometer: odometerSchema.nullable(),
    quantity: z.number().min(0),
    originalPricePerUnit: z.number().min(0),
    pricePerUnit: z.number().min(0),
    isPricePerUnit: z.boolean().default(false)
});

export type FuelLog = z.infer<typeof fuelLogSchema>;