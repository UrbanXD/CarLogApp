import { z } from "zod";
import { expenseSchema } from "../expenseSchema.ts";
import { zNumber, zPickerRequired } from "../../../../types/zodTypes.ts";
import { Car } from "../../../car/schemas/carSchema.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";


const expenseForm = expenseSchema
.pick({ id: true, note: true })
.extend({
    carId: zPickerRequired("Kérem válasszon ki egy autót!").pipe(expenseSchema.shape.carId),
    typeId: zPickerRequired("Kérem válasszon ki egy típust!").pipe(expenseSchema.shape.type.shape.id),
    currencyId: zPickerRequired("Kérem válasszon ki egy valutát!").pipe(expenseSchema.shape.currency.shape.id),
    amount: zNumber(
        { min: expenseSchema.shape.amount.minValue ?? 0 },
        {
            required: "Kérem adja meg a költség összegét",
            minBound: (min) => min === 0
                               ? "A költség összege nem lehet negatív szám."
                               : `A költség összegének minimum ${ min } értékűnek lennie kell.`
        }
    ).pipe(expenseSchema.shape.amount),
    date: z.date({ required_error: "Kérem válasszon ki egy dátumot!" })
    .transform(v => v.toISOString())
    .pipe(expenseSchema.shape.date),
    exchangeRate: zNumber(
        { min: expenseSchema.shape.exchangeRate.minValue ?? 0 },
        {
            required: "Kérem adja meg az átváltási árfolyamot.",
            minBound: (min) => min === 0
                               ? "Az átváltási árfolyam nem lehet negatív szám."
                               : `Az átváltási árfolyamnak minimum legyen legalább ${ min }.`
        }
    ).pipe(expenseSchema.shape.exchangeRate)
});

export type ExpenseFields = z.infer<typeof expenseForm>;

export const useCreateExpenseFormProps = (car: Car | null) => {
    const defaultValues: ExpenseFields = {
        id: getUUID(),
        carId: car?.id,
        typeId: null,
        currencyId: 1,// currencyId: car.currencyId
        amount: NaN,
        exchangeRate: 1,
        note: null,
        date: new Date()
    };

    return { defaultValues, resolver: zodResolver(expenseForm) };
};

// export const useEditOdometerLogFormProps = (odometerLog: OdometerLog) => {
//     const defaultValues: OdometerLogFields = {
//         id: odometerLog.id,
//         carId: odometerLog.carId,
//         typeId: odometerLog.type.id,
//         value: odometerLog.value,
//         note: odometerLog.note,
//         date: odometerLog.date,
//         conversionFactor: odometerLog.unit.conversionFactor
//     };
//
//     return { defaultValues, resolver: zodResolver(odometerLogForm(0)) };
// };