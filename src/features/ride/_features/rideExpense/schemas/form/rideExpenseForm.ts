import { expenseForm } from "../../../../../expense/schemas/form/expenseForm.ts";
import { z } from "zod";
import { rideExpenseSchema } from "../rideExpenseSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { CurrencyEnum } from "../../../../../_shared/currency/enums/currencyEnum.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, UseFormProps } from "react-hook-form";

export const rideExpenseForm = expenseForm
.pick({ typeId: true, date: true, note: true })
.extend({
    id: z.string().uuid(),
    expense: expenseForm.shape.expense.extend({ id: expenseForm.shape.id })
});

export const transformedRideExpenseForm = rideExpenseSchema.omit({ ownerId: true, rideLogId: true });

export type RideExpenseFormTransformedFields = z.infer<typeof transformedRideExpenseForm>;
export type RideExpenseFormFields = z.infer<typeof rideExpenseForm>;

export function useRideExpenseFormProps({
    rideExpense,
    defaultDate,
    defaultCurrencyId
}: {
    rideExpense?: RideExpenseFormTransformedFields,
    defaultDate?: string,
    defaultCurrencyId?: number
}): UseFormProps<RideExpenseFormFields, any, RideExpenseFormFields> {
    const defaultValues: DefaultValues<RideExpenseFormFields> = {
        id: rideExpense?.id ?? getUUID(),
        expense: {
            id: rideExpense?.expense?.id ?? getUUID(),
            currencyId: rideExpense?.expense?.amount.currency?.id ?? defaultCurrencyId ?? CurrencyEnum.EUR,
            amount: rideExpense?.expense?.amount.amount ?? NaN,
            exchangeRate: rideExpense?.expense?.amount.exchangeRate ?? 1
        },
        typeId: rideExpense?.expense?.type?.id,
        note: rideExpense?.expense?.note,
        date: rideExpense?.expense?.date ?? defaultDate ?? new Date().toISOString()
    };

    return { defaultValues, resolver: zodResolver(rideExpenseForm) };
}