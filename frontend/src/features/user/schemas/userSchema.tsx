import { z } from "zod";

export const userSchema = z
.object({
    id: z.string(),
    email: z.string().email("Nem megfelelő email cím formátum"),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    avatarUrl: z.string().optional().nullable(),
    avatarColor: z.string().optional().nullable()
});

export type User = z.infer<typeof userSchema>;