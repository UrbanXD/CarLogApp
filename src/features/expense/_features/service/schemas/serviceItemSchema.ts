import { z } from "zod";
import { serviceLogSchema } from "./serviceLogSchema.ts";
import { serviceItemTypeSchema } from "./serviceItemTypeSchema.ts";
import { carSchema } from "../../../../car/schemas/carSchema.ts";
import { amountSchema } from "../../../../_shared/currency/schemas/amountSchema.ts";

export const serviceItemSchema = z
.object({
    id: z.string().uuid(),
    carId: carSchema.shape.id,
    serviceLogId: z.lazy(() => serviceLogSchema.shape.id),
    type: serviceItemTypeSchema,
    quantity: z.number().int(),
    pricePerUnit: amountSchema
});

export const formResultServiceItemSchema = serviceItemSchema.omit({ carId: true, serviceLogId: true });

export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type FormResultServiceItem = z.infer<typeof formResultServiceItemSchema>;