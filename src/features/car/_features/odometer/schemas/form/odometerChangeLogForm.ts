import { OdometerLog, odometerLogSchema } from "../odometerLogSchema.ts";
import { zDate, zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { z } from "zod";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { Car, carSchema } from "../../../../schemas/carSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { odometerUnitSchema } from "../odometerUnitSchema.ts";
import { zodOdometerValidation } from "../../utils/zodOdometerValidation.ts";
import { OdometerLogDao } from "../../model/dao/OdometerLogDao.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import dayjs from "dayjs";

export const odometerChangeLogForm = (odometerLogDao?: OdometerLogDao, omitOwnerId?: boolean) => {
    let schema = odometerLogSchema
    .pick({ id: true, note: true })
    .extend({
        carId: zPickerRequired("error.car_picker_required").pipe(odometerLogSchema.shape.carId),
        ownerId: carSchema.shape.ownerId, //hidden
        odometerChangeLogId: z.string().uuid(), //hidden
        value: zNumber({
                bounds: { min: 0 },
                errorMessage: {
                    required: "error.odometer_value_required",
                    minBound: () => "error.odometer_value_non_negative"
                }
            }
        ).pipe(odometerLogSchema.shape.value),
        date: zDate().pipe(odometerLogSchema.shape.date),
        conversionFactor: odometerUnitSchema.shape.conversionFactor // hidden
    });

    if(omitOwnerId) schema = schema.omit({ ownerId: true });

    if(odometerLogDao) {
        schema = schema
        .superRefine(async (data, ctx) => {
            await zodOdometerValidation({
                ctx,
                odometerLogDao,
                odometerValueFieldName: "value",
                carId: data.carId,
                date: data.date,
                odometerValue: data.value
            });
        });
    }

    return schema;
};

export type OdometerChangeLogFormFields = z.infer<ReturnType<typeof odometerChangeLogForm>>;

export const useCreateOdometerChangeLogFormProps = (car: Car | null) => {
    const { odometerLogDao } = useDatabase();

    const defaultValues: OdometerChangeLogFormFields = {
        id: getUUID(),
        odometerChangeLogId: getUUID(),
        carId: car?.id,
        ownerId: car?.ownerId,
        value: car?.odometer.value,
        note: null,
        date: new Date(),
        conversionFactor: car?.odometer.unit.conversionFactor ?? 1
    };

    return { defaultValues, resolver: zodResolver(odometerChangeLogForm(odometerLogDao)) };
};

export const useEditOdometerChangeLogFormProps = (odometerLog: OdometerLog) => {
    const { odometerLogDao } = useDatabase();

    const defaultValues: Partial<OdometerChangeLogFormFields> = {
        id: odometerLog.id,
        odometerChangeLogId: odometerLog.relatedId,
        carId: odometerLog.carId,
        value: odometerLog.value,
        note: odometerLog.note,
        date: dayjs(odometerLog.date).isValid() ? dayjs(fuelLog.expense.date).toDate() : new Date(),
        conversionFactor: odometerLog.unit.conversionFactor
    };

    return { defaultValues, resolver: zodResolver(odometerChangeLogForm(odometerLogDao, true)) };
};