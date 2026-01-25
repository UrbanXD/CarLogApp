import { zNumber, zNumberOptional } from "../../../../../../types/zodTypes.ts";
import { z } from "zod";
import { Car } from "../../../../schemas/carSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { CurrencyEnum } from "../../../../../_shared/currency/enums/currencyEnum.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { FuelLog, fuelLogSchema } from "../fuelLogSchema.ts";
import { expenseForm } from "../../../../../expense/schemas/form/expenseForm.ts";
import { odometerLogSchema } from "../../../odometer/schemas/odometerLogSchema.ts";
import { OdometerLogDao } from "../../../odometer/model/dao/OdometerLogDao.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { MIN_ODOMETER_VALUE, zodOdometerValidation } from "../../../odometer/utils/zodOdometerValidation.ts";
import {
    inputAmountSchema,
    inputAmountWithIsPricePerUnit
} from "../../../../../_shared/currency/schemas/inputAmountSchema.ts";
import dayjs from "dayjs";
import { DefaultValues, UseFormProps } from "react-hook-form";

const fuelLogForm = (odometerLogDao: OdometerLogDao) => expenseForm
.pick({ carId: true, date: true, note: true })
.extend({
    expense: inputAmountSchema()
    .extend(inputAmountWithIsPricePerUnit({ defaultIsPricePerUnit: false }).shape)
    .extend({ id: expenseForm.shape.id })
})
.merge(
    fuelLogSchema
    .pick({ id: true })
    .extend({
        quantity: zNumber({
            bounds: { min: fuelLogSchema.shape.quantity.minValue ?? 0 },
            errorMessage: {
                required: "error.fuel_quantity_required",
                minBound: () => "error.odometer_value_non_negative"
            }
        }).pipe(fuelLogSchema.shape.quantity),
        odometerValue: zNumberOptional({
            bounds: { min: MIN_ODOMETER_VALUE },
            errorMessage: { minBound: () => "error.odometer_value_non_negative" }
        }),
        fuelUnitId: fuelLogSchema.shape.fuelUnit.shape.id, // hidden
        odometerLogId: odometerLogSchema.shape.id //hidden
    })
)
.superRefine(async (data, ctx) => {
    await zodOdometerValidation({
        ctx,
        odometerLogDao,
        odometerValueFieldName: "odometerValue",
        carId: data.carId,
        date: data.date,
        odometerValue: data.odometerValue,
        skipOdometerLogs: [data.odometerLogId]
    });
});

export type FuelLogFormFields = z.infer<ReturnType<typeof fuelLogForm>>;

export function useCreateFuelLogFormProps(car: Car | null): UseFormProps<FuelLogFormFields, any, FuelLogFormFields> {
    const { odometerLogDao } = useDatabase();

    const defaultValues: DefaultValues<FuelLogFormFields> = {
        id: getUUID(),
        expense: {
            id: getUUID(),
            currencyId: car?.currency.id ?? CurrencyEnum.EUR,
            amount: 0,
            isPricePerUnit: false,
            exchangeRate: 1
        },
        quantity: 0,
        odometerLogId: getUUID(),
        carId: car?.id,
        fuelUnitId: car?.fuelTank.unit.id,
        odometerValue: undefined,
        note: null,
        date: new Date().toISOString()
    };

    return { defaultValues, resolver: zodResolver(fuelLogForm(odometerLogDao)) };
}

export function useEditFuelLogFormProps(fuelLog: FuelLog): UseFormProps<FuelLogFormFields, any, FuelLogFormFields> {
    const { odometerLogDao } = useDatabase();

    console.log(fuelLog.odometer?.value);

    const defaultValues: DefaultValues<FuelLogFormFields> = {
        id: fuelLog.id,
        expense: {
            id: fuelLog.expense.id,
            currencyId: fuelLog.expense.amount.currency.id,
            amount: fuelLog.isPricePerUnit ? fuelLog.originalPricePerUnit : fuelLog.expense.amount.amount,
            isPricePerUnit: fuelLog.isPricePerUnit,
            exchangeRate: fuelLog.expense.amount.exchangeRate
        },
        quantity: fuelLog.quantity,
        odometerLogId: fuelLog.odometer?.id ?? getUUID(),
        carId: fuelLog.car.id,
        fuelUnitId: fuelLog.fuelUnit.id,
        odometerValue: fuelLog.odometer?.value ?? undefined,
        note: fuelLog.expense.note,
        date: dayjs(fuelLog.expense.date).isValid() ? fuelLog.expense.date : new Date().toISOString()
    };

    return { defaultValues, resolver: zodResolver(fuelLogForm(odometerLogDao)) };
};