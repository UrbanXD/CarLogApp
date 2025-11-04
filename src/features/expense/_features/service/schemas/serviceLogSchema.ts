import { z } from "zod";
import { expenseSchema } from "../../../schemas/expenseSchema.ts";
import { odometerSchema } from "../../../../car/_features/odometer/schemas/odometerSchema.ts";
import { serviceTypeSchema } from "./serviceTypeSchema.ts";
import { serviceItemSchema } from "./serviceItemSchema.ts";
import { amountSchema } from "../../../../_shared/currency/schemas/amountSchema.ts";

export const serviceLogSchema = z
.object({
    id: z.string().uuid(),
    carId: z.string().uuid(),
    expense: expenseSchema,
    odometer: odometerSchema.nullable(),
    serviceType: serviceTypeSchema,
    items: z.array(serviceItemSchema),
    totalAmount: z.array(amountSchema)
});

export type ServiceLog = z.infer<typeof serviceLogSchema>