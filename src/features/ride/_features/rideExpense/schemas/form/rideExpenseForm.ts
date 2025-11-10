import { expenseForm } from "../../../../../expense/schemas/form/expenseForm.ts";
import { z } from "zod";
import { RideExpense } from "../rideExpenseSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { CurrencyEnum } from "../../../../../_shared/currency/enums/currencyEnum.ts";
import { zodResolver } from "@hookform/resolvers/zod";

export const rideExpenseForm = expenseForm
.omit({ id: true, carId: true })
.extend({
    id: z.string().uuid(),
    expenseId: expenseForm.shape.id
});

export type RideExpenseFormFields = z.infer<typeof rideExpenseForm>;

export function useRideExpenseFormProps({
    rideExpense,
    defaultDate,
    defaultCurrencyId
}: { rideExpense?: RideExpense, defaultDate?: string, defaultCurrencyId?: number }) {
    const defaultValues: RideExpenseFormFields = {
        id: rideExpense?.id ?? getUUID(),
        expenseId: rideExpense?.expense?.id ?? getUUID(),
        typeId: rideExpense?.expense?.type?.id ?? null,
        currencyId: rideExpense?.expense?.amount.currency?.id ?? defaultCurrencyId ?? CurrencyEnum.EUR,
        amount: rideExpense?.expense?.amount.amount ?? NaN,
        exchangeRate: rideExpense?.expense?.amount.exchangeRate ?? 1,
        note: rideExpense?.expense?.note ?? null,
        date: rideExpense?.expense?.date ?? defaultDate ?? new Date()
    };

    return { defaultValues, resolver: zodResolver(rideExpenseForm) };
}