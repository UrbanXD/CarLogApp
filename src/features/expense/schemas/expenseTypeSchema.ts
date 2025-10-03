import { z } from "zod";

export const expenseTypeSchema = z
.object({
    id: z.string().uuid(),
    key: z.string().max(64),
    locale: z.string().max(64),
    icon: z.string().nullable(),
    primaryColor: z.string().nullable(),
    secondaryColor: z.string().nullable(),
    ownerId: z.string().uuid().nullable() // when null it means its global
});

export type ExpenseType = z.infer<typeof expenseTypeSchema>;