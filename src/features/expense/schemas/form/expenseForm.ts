import { z } from "zod";
import { Expense, expenseSchema } from "../expenseSchema.ts";
import { zDate, zPickerRequired } from "../../../../types/zodTypes.ts";
import { Car } from "../../../car/schemas/carSchema.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyEnum } from "../../../_shared/currency/enums/currencyEnum.ts";
import { inputAmountSchema } from "../../../_shared/currency/schemas/inputAmountSchema.ts";
import dayjs from "dayjs";

export const expenseForm = expenseSchema
.pick({ id: true, note: true })
.extend({
    carId: zPickerRequired("error.car_picker_required").pipe(expenseSchema.shape.carId),
    typeId: zPickerRequired("error.type_picker_required").pipe(expenseSchema.shape.type.shape.id),
    expense: inputAmountSchema({
        minAmount: expenseSchema.shape.amount.shape.amount.minValue ?? 0,
        minExchangeRate: expenseSchema.shape.amount.shape.exchangeRate.minValue ?? 0
    }),
    date: zDate().pipe(expenseSchema.shape.date)
});

export type ExpenseFields = z.infer<typeof expenseForm>;

export function useCreateExpenseFormProps(car: Car | null) {
    const defaultValues: ExpenseFields = {
        id: getUUID(),
        carId: car?.id,
        typeId: null,
        expense: {
            amount: null,
            currencyId: car?.currency.id ?? CurrencyEnum.EUR,
            exchangeRate: 1
        },
        note: null,
        date: new Date()
    };

    return { defaultValues, resolver: zodResolver(expenseForm) };
}

export function useEditExpenseFormProps(expense: Expense) {
    const defaultValues: ExpenseFields = {
        id: expense.id,
        carId: expense.carId,
        typeId: expense.type.id,
        expense: {
            amount: expense.amount.amount,
            currencyId: expense.amount.currency.id,
            exchangeRate: expense.amount.exchangeRate
        },
        note: expense.note,
        date: dayjs(expense.date).isValid() ? dayjs(expense.date).toDate() : new Date()

    };

    return { defaultValues, resolver: zodResolver(expenseForm) };
}