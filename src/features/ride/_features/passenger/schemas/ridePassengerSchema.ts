import { z } from "zod";
import { passengerSchema } from "./passengerSchema.ts";

export const ridePassengerSchema = passengerSchema
.omit({ id: true })
.extend({
    id: z.string().uuid(),
    passengerId: passengerSchema.shape.id,
    rideLogId: z.string().uuid(),
    order: z.number().int()
});

export type RidePassenger = z.infer<typeof ridePassengerSchema>;