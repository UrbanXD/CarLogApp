import { z } from "zod";

export const modelSchema = z
.object({
    id: z.string().uuid(),
    makeId: z.string().uuid(),
    name: z.string(),
    startYear: z.string(),
    endYear: z.string().nullable()
});

export type Model = z.infer<typeof modelSchema>;