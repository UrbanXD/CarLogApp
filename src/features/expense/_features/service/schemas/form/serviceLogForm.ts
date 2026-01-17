import { z } from "zod";
import { expenseForm } from "../../../../schemas/form/expenseForm.ts";
import { ServiceLog, serviceLogSchema } from "../serviceLogSchema.ts";
import { zNumber, zPickerRequiredString } from "../../../../../../types/zodTypes.ts";
import { odometerLogSchema } from "../../../../../car/_features/odometer/schemas/odometerLogSchema.ts";
import { Car } from "../../../../../car/schemas/carSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { OdometerLogDao } from "../../../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import {
    MIN_ODOMETER_VALUE,
    zodOdometerValidation
} from "../../../../../car/_features/odometer/utils/zodOdometerValidation.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import dayjs from "dayjs";
import { transformedServiceItemForm } from "./serviceItemForm.ts";
import { DefaultValues, UseFormProps } from "react-hook-form";

const serviceLogForm = (odometerLogDao: OdometerLogDao) => expenseForm
.pick({ date: true, note: true })
.extend({ expenseId: expenseForm.shape.id })
.merge(
    serviceLogSchema
    .pick({ id: true, carId: true })
    .extend({
        items: z.array(transformedServiceItemForm),
        serviceTypeId: zPickerRequiredString({ errorMessage: "error.service_type_required" })
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

export type ServiceLogDefaultValues = z.infer<ReturnType<typeof serviceLogForm>>;
export type ServiceLogFormFields = z.infer<ReturnType<typeof serviceLogForm>>;

export function useCreateServiceLogFormProps(car: Car | null): UseFormProps<ServiceLogFormFields, any, ServiceLogFormFields> {
    const { odometerLogDao } = useDatabase();

    const defaultValues: DefaultValues<ServiceLogFormFields> = {
        id: getUUID(),
        expenseId: getUUID(),
        odometerLogId: getUUID(),
        carId: car?.id,
        serviceTypeId: undefined,
        items: [],
        odometerValue: undefined,
        note: null,
        date: new Date().toISOString()
    };

    return { defaultValues, resolver: zodResolver(serviceLogForm(odometerLogDao)) };
}

export function useEditServiceLogFormProps(serviceLog: ServiceLog): UseFormProps<ServiceLogFormFields, any, ServiceLogFormFields> {
    const { odometerLogDao } = useDatabase();

    const defaultValues: DefaultValues<ServiceLogFormFields> = {
        id: serviceLog.id,
        expenseId: serviceLog.expense.id,
        odometerLogId: serviceLog.odometer?.id ?? getUUID(),
        carId: serviceLog.carId,
        serviceTypeId: serviceLog.serviceType.id,
        items: serviceLog.items,
        odometerValue: serviceLog.odometer?.value,
        note: serviceLog.expense.note,
        date: dayjs(serviceLog.expense.date).isValid()
              ? dayjs(serviceLog.expense.date).toDate().toISOString()
              : new Date().toISOString()
    };

    return { defaultValues, resolver: zodResolver(serviceLogForm(odometerLogDao)) };
}