import { z } from "zod";
import { CurrencyType } from "../../_shared/enums/currencyType.ts";
import { expenseTypeSchema } from "./expenseTypeSchema.ts";

export const expenseSchema = z
.object({
    id: z.string().uuid(),
    carId: z.string().uuid(),
    type: expenseTypeSchema,
    amount: z.number().min(0),
    currency: z.enum(Object.keys(CurrencyType)),
    note: z.string().nullable(),
    date: z.string()
});

export type Expense = z.infer<typeof expenseSchema>;