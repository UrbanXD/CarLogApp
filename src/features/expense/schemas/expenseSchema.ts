import { z } from "zod";
import { expenseTypeSchema } from "./expenseTypeSchema.ts";
import { currencySchema } from "../../_shared/currency/schemas/currencySchema.ts";
import { zNote } from "../../../types/zodTypes.ts";

export const expenseSchema = z
.object({
    id: z.string().uuid(),
    carId: z.string().uuid(),
    relatedId: z.string().uuid().nullable().optional(),
    type: expenseTypeSchema,
    originalAmount: z.number().min(0),
    exchangeRate: z.number().min(0),
    amount: z.number().min(0),
    currency: currencySchema,
    note: zNote(),
    date: z.string()
});

export type Expense = z.infer<typeof expenseSchema>;