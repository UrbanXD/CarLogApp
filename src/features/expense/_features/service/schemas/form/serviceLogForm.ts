import { z } from "zod";
import { expenseForm } from "../../../../schemas/form/expenseForm.ts";
import { ServiceLog, serviceLogSchema } from "../serviceLogSchema.ts";
import { zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { odometerLogSchema } from "../../../../../car/_features/odometer/schemas/odometerLogSchema.ts";
import { Car } from "../../../../../car/schemas/carSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { formResultServiceItemSchema } from "../serviceItemSchema.ts";
import { OdometerLogDao } from "../../../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import {
    MIN_ODOMETER_VALUE,
    zodOdometerValidation
} from "../../../../../car/_features/odometer/utils/zodOdometerValidation.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import dayjs from "dayjs";

const serviceLogForm = (odometerLogDao: OdometerLogDao) => expenseForm
.pick({ date: true, note: true })
.extend({ expenseId: expenseForm.shape.id })
.merge(
    serviceLogSchema
    .pick({ id: true, carId: true })
    .extend({
        items: z.array(formResultServiceItemSchema),
        serviceTypeId: zPickerRequired("error.service_type_required")
        .pipe(serviceLogSchema.shape.serviceType.shape.id),
        odometerValue: zNumber({
            bounds: { min: MIN_ODOMETER_VALUE },
            errorMessage: {
                required: "error.odometer_value_required",
                minBound: () => "error.odometer_value_non_negative"
            }
        }),
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

export type ServiceLogFields = z.infer<typeof serviceLogForm>;

export function useCreateServiceLogFormProps(car: Car | null) {
    const { odometerLogDao } = useDatabase();

    const defaultValues: ServiceLogFields = {
        id: getUUID(),
        expenseId: getUUID(),
        odometerLogId: getUUID(),
        carId: car?.id,
        serviceTypeId: null,
        items: [],
        odometerValue: null,
        note: null,
        date: new Date()
    };

    return { defaultValues, resolver: zodResolver(serviceLogForm(odometerLogDao)) };
}

export function useEditServiceLogFormProps(serviceLog: ServiceLog) {
    const { odometerLogDao } = useDatabase();

    const defaultValues: ServiceLogFields = {
        id: serviceLog.id,
        expenseId: serviceLog.expense.id,
        odometerLogId: serviceLog.odometer?.id ?? getUUID(),
        carId: serviceLog.carId,
        serviceTypeId: serviceLog.serviceType.id,
        items: serviceLog.items,
        odometerValue: serviceLog.odometer?.value ?? null,
        note: serviceLog.expense.note,
        date: dayjs(serviceLog.expense.date).isValid() ? dayjs(serviceLog.expense.date).toDate() : new Date()
    };

    return { defaultValues, resolver: zodResolver(serviceLogForm(odometerLogDao)) };
}