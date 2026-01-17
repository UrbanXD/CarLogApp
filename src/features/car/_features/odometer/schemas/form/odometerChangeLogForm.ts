import { OdometerLog, odometerLogSchema } from "../odometerLogSchema.ts";
import { zDate, zNumber, zPickerRequiredString } from "../../../../../../types/zodTypes.ts";
import { z } from "zod";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { Car } from "../../../../schemas/carSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { odometerUnitSchema } from "../odometerUnitSchema.ts";
import { MIN_ODOMETER_VALUE, zodOdometerValidation } from "../../utils/zodOdometerValidation.ts";
import { OdometerLogDao } from "../../model/dao/OdometerLogDao.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import dayjs from "dayjs";
import { DefaultValues, UseFormProps } from "react-hook-form";

export const odometerChangeLogForm = (odometerLogDao: OdometerLogDao) => odometerLogSchema
.pick({ id: true, note: true })
.extend({
    carId: zPickerRequiredString({ errorMessage: "error.car_picker_required" }).pipe(odometerLogSchema.shape.carId),
    odometerChangeLogId: z.string().uuid(), //hidden
    value: zNumber({
            bounds: { min: MIN_ODOMETER_VALUE },
            errorMessage: {
                required: "error.odometer_value_required",
                minBound: () => "error.odometer_value_non_negative"
            }
        }
    ).pipe(odometerLogSchema.shape.value),
    date: zDate().pipe(odometerLogSchema.shape.date),
    conversionFactor: odometerUnitSchema.shape.conversionFactor // hidden
}).superRefine(async (data, ctx) => {
    await zodOdometerValidation({
        ctx,
        odometerLogDao,
        odometerValueFieldName: "value",
        carId: data.carId,
        date: data.date,
        odometerValue: data.value,
        skipOdometerLogs: [data.id]
    });
});

export type OdometerChangeLogFormFields = z.infer<ReturnType<typeof odometerChangeLogForm>>;

export const useCreateOdometerChangeLogFormProps = (car: Car | null): UseFormProps<OdometerChangeLogFormFields, any, OdometerChangeLogFormFields> => {
    const { odometerLogDao } = useDatabase();

    const defaultValues: DefaultValues<OdometerChangeLogFormFields> = {
        id: getUUID(),
        odometerChangeLogId: getUUID(),
        carId: car?.id,
        value: car?.odometer.value,
        note: null,
        date: new Date().toISOString(),
        conversionFactor: car?.odometer.unit.conversionFactor ?? 1
    };

    return { defaultValues, resolver: zodResolver(odometerChangeLogForm(odometerLogDao)) };
};

export const useEditOdometerChangeLogFormProps = (odometerLog: OdometerLog): UseFormProps<OdometerChangeLogFormFields, any, OdometerChangeLogFormFields> => {
    const { odometerLogDao } = useDatabase();

    const defaultValues: DefaultValues<OdometerChangeLogFormFields> = {
        id: odometerLog.id,
        odometerChangeLogId: odometerLog.relatedId ?? undefined,
        carId: odometerLog.carId,
        value: odometerLog.value,
        note: odometerLog.note,
        date: dayjs(odometerLog.date).isValid() ? dayjs(odometerLog.date).toISOString() : new Date().toISOString(),
        conversionFactor: odometerLog.unit.conversionFactor
    };

    return { defaultValues, resolver: zodResolver(odometerChangeLogForm(odometerLogDao)) };
};