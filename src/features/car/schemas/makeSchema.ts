import { z } from "zod";

export const makeSchema = z
.object({
    id: z.string(),
    name: z.string()
});

export type Make = z.infer<typeof makeSchema>;