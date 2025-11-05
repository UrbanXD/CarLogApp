import { z } from "zod";

export const placeSchema = z
.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    name: z.string()
});

export type Place = z.infer<typeof placeSchema>;