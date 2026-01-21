import { z } from "zod";
import { expenseTypeSchema } from "./expenseTypeSchema.ts";
import { zNote } from "../../../types/zodTypes.ts";
import { amountSchema } from "../../_shared/currency/schemas/amountSchema.ts";
import { carNameAndModelSchema } from "../../car/schemas/carSchema.ts";

export const expenseSchema = z
.object({
    id: z.string().uuid(),
    car: carNameAndModelSchema,
    relatedId: z.string().uuid().nullable().optional(),
    type: expenseTypeSchema,
    amount: amountSchema,
    note: zNote(),
    date: z.string()
});

export type Expense = z.infer<typeof expenseSchema>;