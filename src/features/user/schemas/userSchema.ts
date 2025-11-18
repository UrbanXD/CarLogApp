import { z } from "zod";
import { zImage } from "../../../types/zodTypes.ts";
import { currencySchema } from "../../_shared/currency/schemas/currencySchema.ts";

export const userSchema = z
.object({
    id: z.string(),
    email: z.string().email("Nem megfelelő email cím formátum"),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    currency: currencySchema,
    avatar: zImage.optional().nullable(),
    avatarColor: z.string().optional().nullable()
});

export type UserAccount = z.infer<typeof userSchema>;