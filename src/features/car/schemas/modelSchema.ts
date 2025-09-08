import { z } from "zod";

export const modelSchema = z
.object({
    id: z.string(),
    makeId: z.string(),
    name: z.string(),
    startYear: z.string(),
    endYear: z.string().nullable()
});

export type Model = z.infer<typeof modelSchema>;