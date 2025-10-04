import { z } from "zod";
import { expenseTypeSchema } from "./expenseTypeSchema.ts";
import { currencySchema } from "../../_shared/currency/schemas/currencySchema.ts";

export const expenseSchema = z
.object({
    id: z.string().uuid(),
    carId: z.string().uuid(),
    type: expenseTypeSchema,
    amount: z.number().min(0),
    exchangeRate: z.number().min(0),
    currency: currencySchema,
    note: z.string().nullable(),
    date: z.string()
});

export type Expense = z.infer<typeof expenseSchema>;