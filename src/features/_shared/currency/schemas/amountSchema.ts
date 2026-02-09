import { z } from "zod";
import { currencySchema } from "./currencySchema.ts";

export const amountSchema = z
.object({
    amount: z.number().min(0),
    exchangedAmount: z.number().min(0),
    exchangeRate: z.number().min(0),
    currency: currencySchema,
    exchangeCurrency: currencySchema
});

export type Amount = z.infer<typeof amountSchema>;