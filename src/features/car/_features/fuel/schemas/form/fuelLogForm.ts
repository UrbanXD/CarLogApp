import { zNumber } from "../../../../../../types/zodTypes.ts";
import { z } from "zod";
import { Car } from "../../../../schemas/carSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { CurrencyEnum } from "../../../../../_shared/currency/enums/currencyEnum.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { FuelLog, fuelLogSchema } from "../fuelLogSchema.ts";
import { expenseForm } from "../../../../../expense/schemas/form/expenseForm.ts";
import { odometerLogSchema } from "../../../odometer/schemas/odometerLogSchema.ts";

const fuelLogForm = expenseForm
.pick({ carId: true, currencyId: true, amount: true, exchangeRate: true, date: true, note: true })
.extend({ expenseId: expenseForm.shape.id, isPricePerUnit: z.boolean().default(false) })
.merge(
    fuelLogSchema.pick({ id: true, ownerId: true }).extend({
        quantity: zNumber({
            bounds: { min: fuelLogSchema.shape.quantity.minValue ?? 0 },
            errorMessage: {
                required: "error.fuel_quantity_required",
                minBound: (min) =>
                    min === 0
                    ? "error.fuel_quantity_non_negative"
                    : `error.fuel_quantity_min_limit;${ min }`
            }
        }).pipe(fuelLogSchema.shape.quantity),
        odometerValue: zNumber({
            optional: true,
            bounds: { min: 0 },
            errorMessage: {
                minBound: (min) =>
                    min === 0
                    ? "error.odometer_value_non_negative"
                    : "error.odometer_value_min_limit"
            }
        }),
        fuelUnitId: fuelLogSchema.shape.fuelUnit.shape.id, // hidden
        odometerLogId: odometerLogSchema.shape.id //hidden
    })
);

export type FuelLogFields = z.infer<typeof fuelLogForm>;

export function useCreateFuelLogFormProps(car: Car | null) {
    const defaultValues: FuelLogFields = {
        id: getUUID(),
        expenseId: getUUID(),
        odometerLogId: getUUID(),
        ownerId: car?.ownerId,
        carId: car?.id,
        fuelUnitId: car?.fuelTank.unit.id,
        currencyId: car?.currency.id ?? CurrencyEnum.EUR,
        amount: NaN,
        isPricePerUnit: false,
        exchangeRate: 1,
        quantity: 0,
        odometerValue: NaN,
        note: null,
        date: new Date()
    };

    return { defaultValues, resolver: zodResolver(fuelLogForm) };
}

export const useEditFuelLogFormProps = (fuelLog: FuelLog) => {
    const defaultValues: FuelLogFields = {
        id: fuelLog.id,
        expenseId: fuelLog.expense.id,
        odometerLogId: fuelLog.odometer?.id ?? getUUID(),
        ownerId: fuelLog.ownerId,
        carId: fuelLog.expense.carId,
        fuelUnitId: fuelLog.fuelUnit.id,
        currencyId: fuelLog.expense.amount.currency.id,
        amount: fuelLog.isPricePerUnit ? fuelLog.originalPricePerUnit : fuelLog.expense.amount.amount,
        isPricePerUnit: fuelLog.isPricePerUnit,
        exchangeRate: fuelLog.expense.amount.exchangeRate,
        quantity: fuelLog.quantity,
        odometerValue: fuelLog.odometer?.value ?? NaN,
        note: fuelLog.expense.note,
        date: fuelLog.expense.date
    };

    return { defaultValues, resolver: zodResolver(fuelLogForm) };
};