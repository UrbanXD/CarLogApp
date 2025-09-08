import { z } from "zod";

export const modelSchema = z
.object({
    id: z.string(),
    makeId: z.number(),
    name: z.string(),
    startYear: z.string(),
    endYear: z.string()
});

export type Model = z.infer<typeof modelSchema>;