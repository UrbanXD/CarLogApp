import { z } from "zod";
import { zImage } from "../../../types/zodTypes.ts";

export const userSchema = z
.object({
    id: z.string(),
    email: z.string().email("Nem megfelelő email cím formátum"),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    avatar: zImage.optional().nullable(),
    avatarColor: z.string().optional().nullable()
});

export type User = z.infer<typeof userSchema>;