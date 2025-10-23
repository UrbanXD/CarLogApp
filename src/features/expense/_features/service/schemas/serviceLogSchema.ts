import { z } from "zod";
import { expenseSchema } from "../../../schemas/expenseSchema.ts";
import { odometerSchema } from "../../../../car/_features/odometer/schemas/odometerSchema.ts";
import { serviceTypeSchema } from "./serviceTypeSchema.ts";

export const serviceLogSchema = z
.object({
    id: z.string().uuid(),
    carId: z.string().uuid(),
    expense: expenseSchema,
    odometer: odometerSchema.nullable(),
    serviceType: serviceTypeSchema
});

export type ServiceLog = z.infer<typeof serviceLogSchema>