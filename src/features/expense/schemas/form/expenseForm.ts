import { z } from "zod";
import { Expense, expenseSchema } from "../expenseSchema.ts";
import { zDate, zNumber, zPickerRequired } from "../../../../types/zodTypes.ts";
import { Car } from "../../../car/schemas/carSchema.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyEnum } from "../../../_shared/currency/enums/currencyEnum.ts";

export const expenseForm = expenseSchema
.pick({ id: true, note: true })
.extend({
    carId: zPickerRequired("error.car_picker_required").pipe(expenseSchema.shape.carId),
    typeId: zPickerRequired("error.type_picker_required").pipe(expenseSchema.shape.type.shape.id),
    currencyId: zPickerRequired("error.currency_picker_required")
    .pipe(expenseSchema.shape.amount.shape.currency.shape.id),
    amount: zNumber({
        bounds: { min: expenseSchema.shape.amount.shape.amount.minValue ?? 0 },
        errorMessage: {
            required: "error.expense_amount_required",
            minBound: (min) => min === 0
                               ? "error.expense_amount_non_negative"
                               : `error.expense_amount_min_limit;${ min }`
        }
    }).pipe(expenseSchema.shape.amount.shape.amount),
    date: zDate().pipe(expenseSchema.shape.date),
    exchangeRate: zNumber({
        bounds: { min: expenseSchema.shape.amount.shape.exchangeRate.minValue ?? 0 },
        errorMessage: {
            required: "error.exchange_rate_required",
            minBound: (min) => min === 0
                               ? "error.exchange_rate_non_negative"
                               : `error;${ min }`
        }
    }).pipe(expenseSchema.shape.amount.shape.exchangeRate)
});

export type ExpenseFields = z.infer<typeof expenseForm>;

export function useCreateExpenseFormProps(car: Car | null) {
    const defaultValues: ExpenseFields = {
        id: getUUID(),
        carId: "",
        typeId: null,
        currencyId: car?.currency.id ?? CurrencyEnum.EUR,
        amount: NaN,
        exchangeRate: 1,
        note: null,
        date: new Date().toISOString()
    };

    return { defaultValues, resolver: zodResolver(expenseForm) };
}

export function useEditExpenseFormProps(expense: Expense) {
    const defaultValues: ExpenseFields = {
        id: expense.id,
        carId: expense.carId,
        typeId: expense.type.id,
        currencyId: expense.amount.currency.id,
        amount: expense.amount.amount,
        exchangeRate: expense.amount.exchangeRate,
        note: expense.note,
        date: expense.date
    };

    return { defaultValues, resolver: zodResolver(expenseForm) };
}