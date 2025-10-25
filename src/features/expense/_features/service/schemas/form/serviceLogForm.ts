import { z } from "zod";
import { expenseForm } from "../../../../schemas/form/expenseForm.ts";
import { serviceLogSchema } from "../serviceLogSchema.ts";
import { zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { odometerLogSchema } from "../../../../../car/_features/odometer/schemas/odometerLogSchema.ts";
import { serviceItemForm } from "./serviceItemForm.ts";
import { Car } from "../../../../../car/schemas/carSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";

const serviceLogForm = expenseForm
.pick({ date: true, note: true })
.extend({ expenseId: expenseForm.shape.id })
.merge(
    serviceLogSchema
    .pick({ id: true, carId: true })
    .extend({
        items: z.array(serviceItemForm),
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

export function userCreateServiceLogForm(car: Car | null) {
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
}