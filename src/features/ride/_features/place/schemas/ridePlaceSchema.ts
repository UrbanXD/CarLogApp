import { z } from "zod";
import { placeSchema } from "./placeSchema.ts";

export const ridePlaceSchema = placeSchema
.omit({ id: true })
.extend({
    id: z.string().uuid(),
    placeId: placeSchema.shape.id,
    rideLogId: z.string().uuid(),
    name: placeSchema.shape.name,
    order: z.number().int()
});

export type RidePlace = z.infer<typeof ridePlaceSchema>;