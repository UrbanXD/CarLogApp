import { z } from "zod";

export const passengerSchema = z
.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    name: z.string()
});

export type Passenger = z.infer<typeof passengerSchema>;