import { z } from "zod";
import { expenseForm } from "../../../../schemas/form/expenseForm.ts";
import { ServiceLog, serviceLogSchema } from "../serviceLogSchema.ts";
import { zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { odometerLogSchema } from "../../../../../car/_features/odometer/schemas/odometerLogSchema.ts";
import { Car } from "../../../../../car/schemas/carSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { formResultServiceItem } from "../serviceItemSchema.ts";

const serviceLogForm = expenseForm
.pick({ date: true, note: true })
.extend({ expenseId: expenseForm.shape.id })
.merge(
    serviceLogSchema
    .pick({ id: true, carId: true })
    .extend({
        items: z.array(formResultServiceItem),
        serviceTypeId: zPickerRequired("Kérem válasszon ki egy típust!")
        .pipe(serviceLogSchema.shape.serviceType.shape.id),
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
        odometerLogId: odometerLogSchema.shape.id //hidden
    })
);

export type ServiceLogFields = z.infer<typeof serviceLogForm>;

export function useCreateServiceLogFormProps(car: Car | null) {
    const defaultValues: ServiceLogFields = {
        id: getUUID(),
        expenseId: getUUID(),
        odometerLogId: getUUID(),
        carId: car?.id,
        serviceTypeId: null,
        items: [],
        odometerValue: NaN,
        note: null,
        date: new Date()
    };

    return { defaultValues, resolver: zodResolver(serviceLogForm) };
}

export function useEditServiceLogFormProps(serviceLog: ServiceLog) {
    const defaultValues: ServiceLogFields = {
        id: serviceLog.id,
        expenseId: serviceLog.expense.id,
        odometerLogId: serviceLog.odometer?.id ?? getUUID(),
        carId: serviceLog.carId,
        serviceTypeId: serviceLog.serviceType.id,
        items: serviceLog.items,
        odometerValue: serviceLog.odometer?.value ?? NaN,
        note: serviceLog.expense.note,
        date: serviceLog.expense.date
    };

    return { defaultValues, resolver: zodResolver(serviceLogForm) };
}