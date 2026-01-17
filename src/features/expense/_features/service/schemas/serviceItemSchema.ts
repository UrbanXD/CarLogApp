import { z } from "zod";
import { serviceItemTypeSchema } from "./serviceItemTypeSchema.ts";
import { carSchema } from "../../../../car/schemas/carSchema.ts";
import { amountSchema } from "../../../../_shared/currency/schemas/amountSchema.ts";

export const serviceItemSchema = z
.object({
    id: z.string().uuid(),
    carId: carSchema.shape.id,
    serviceLogId: z.string().uuid(),
    type: serviceItemTypeSchema,
    quantity: z.number().int(),
    pricePerUnit: amountSchema
});

export type ServiceItem = z.infer<typeof serviceItemSchema>;
