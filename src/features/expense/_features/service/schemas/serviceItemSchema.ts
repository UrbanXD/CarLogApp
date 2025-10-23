import { z } from "zod";
import { serviceLogSchema } from "./serviceLogSchema.ts";
import { serviceItemTypeSchema } from "./serviceItemTypeSchema.ts";
import { carSchema } from "../../../../car/schemas/carSchema.ts";

export const serviceItemSchema = z
.object({
    id: z.string().uuid(),
    carId: carSchema.shape.id,
    serviceLogId: serviceLogSchema.shape.id,
    type: serviceItemTypeSchema,
    quantity: z.number().int(),
    pricePerUnit: z.number().min(0)
});

export type ServiceItem = z.infer<typeof serviceItemSchema>;