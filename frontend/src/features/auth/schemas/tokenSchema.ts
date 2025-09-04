import { z } from "zod";

export const tokenSchema = z
.object({
    token: z.string(),
    refreshToken: z.string()
});

export type Token = z.infer<typeof tokenSchema>;