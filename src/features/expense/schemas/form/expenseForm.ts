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
    carId: zPickerRequired("Kérem válasszon ki egy autót!").pipe(expenseSchema.shape.carId),
    typeId: zPickerRequired("Kérem válasszon ki egy típust!").pipe(expenseSchema.shape.type.shape.id),
    currencyId: zPickerRequired("Kérem válasszon ki egy valutát!").pipe(expenseSchema.shape.currency.shape.id),
    amount: zNumber({
        bounds: { min: expenseSchema.shape.amount.minValue ?? 0 },
        errorMessage: {
            required: "Kérem adja meg a költség összegét",
            minBound: (min) => min === 0
                               ? "A költség összege nem lehet negatív szám."
                               : `A költség összegének minimum ${ min } értékűnek lennie kell.`
        }
    }).pipe(expenseSchema.shape.amount),
    date: zDate().pipe(expenseSchema.shape.date),
    exchangeRate: zNumber({
        bounds: { min: expenseSchema.shape.exchangeRate.minValue ?? 0 },
        errorMessage: {
            required: "Kérem adja meg az átváltási árfolyamot.",
            minBound: (min) => min === 0
                               ? "Az átváltási árfolyam nem lehet negatív szám."
                               : `Az átváltási árfolyamnak minimum legyen legalább ${ min }.`
        }
    }).pipe(expenseSchema.shape.exchangeRate)
});

export type ExpenseFields = z.infer<typeof expenseForm>;

export function useCreateExpenseFormProps(car: Car | null) {
    const defaultValues: ExpenseFields = {
        id: getUUID(),
        carId: car?.id,
        typeId: null,
        currencyId: car?.currency.id ?? CurrencyEnum.EUR,
        amount: NaN,
        exchangeRate: 1,
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
        currencyId: expense.currency.id,
        amount: expense.originalAmount,
        exchangeRate: expense.exchangeRate,
        note: expense.note,
        date: expense.date
    };

    return { defaultValues, resolver: zodResolver(expenseForm) };
}