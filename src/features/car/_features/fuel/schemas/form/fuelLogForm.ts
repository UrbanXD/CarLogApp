import { zNumber } from "../../../../../../types/zodTypes.ts";
import { z } from "zod";
import { Car } from "../../../../schemas/carSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { CurrencyEnum } from "../../../../../_shared/currency/enums/currencyEnum.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { fuelLogSchema } from "../fuelLogSchema.ts";
import { expenseForm } from "../../../../../expense/schemas/form/expenseForm.ts";
import { odometerLogSchema } from "../../../odometer/schemas/odometerLogSchema.ts";

const fuelLogForm = expenseForm
.pick({ carId: true, currencyId: true, amount: true, exchangeRate: true, date: true, note: true })
.extend({ expenseId: expenseForm.shape.id })
.merge(
    fuelLogSchema.pick({ id: true, ownerId: true }).extend({
        quantity: zNumber({
            bounds: { min: fuelLogSchema.shape.quantity.minValue ?? 0 },
            errorMessage: {
                required: "Kérem adja meg mennyit tankolt",
                minBound: (min) =>
                    min === 0
                    ? "A tankolt mennyiség nem lehet negatív szám."
                    : `A tankolt mennyiségnek minimum ${ min } értékűnek lennie kell.`
            }
        }).pipe(fuelLogSchema.shape.quantity),
        odometerValue: zNumber({
            optional: true,
            bounds: { min: 0 },
            errorMessage: {
                minBound: (min) =>
                    min === 0
                    ? "A kilométeróra-állás nem lehet negatív szám"
                    : `Visszafelé nem pöröghet a kilométeróra, a jelenlegi állás ${ min }.`
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
        exchangeRate: 1,
        quantity: 0,
        odometerValue: NaN,
        note: null,
        date: new Date()
    };

    return { defaultValues, resolver: zodResolver(fuelLogForm) };
}