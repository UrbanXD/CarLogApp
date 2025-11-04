import { z } from "zod";

export const currencySchema = z
.object({
    id: z.coerce.number(),
    key: z.string(),
    symbol: z.string()
});

export type Currency = z.infer<typeof currencySchema>;