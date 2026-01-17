import { z } from "zod";
import { currencySchema } from "../../_shared/currency/schemas/currencySchema.ts";

export const userSchema = z
.object({
    id: z.string(),
    email: z.string().email("error.email_format"),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    currency: currencySchema,
    avatarPath: z.string().optional().nullable(),
    avatarColor: z.string().optional().nullable()
});

export type UserAccount = z.infer<typeof userSchema>;