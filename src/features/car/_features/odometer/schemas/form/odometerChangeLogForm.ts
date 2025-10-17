import { OdometerLog, odometerLogSchema } from "../odometerLogSchema.ts";
import { zDate, zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { z } from "zod";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { Car, carSchema } from "../../../../schemas/carSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { odometerUnitSchema } from "../odometerUnitSchema.ts";

export const odometerChangeLogForm = (highestOdometerValue?: number = 0) => odometerLogSchema
.pick({ id: true, note: true })
.extend({
    carId: zPickerRequired("Kérem válasszon ki egy autót!").pipe(odometerLogSchema.shape.carId),
    ownerId: carSchema.shape.ownerId, //hidden
    odometerChangeLogId: z.string().uuid(), //hidden
    value: zNumber({
            bounds: { min: highestOdometerValue },
            errorMessage: {
                minBound: (min) => min === 0
                                   ? "A kilométeróra-állás nem lehet negatív szám"
                                   : `Visszafelé nem pöröghet a kilométeróra, a jelenlegi állás ${ min }.`
            }
        }
    ).pipe(odometerLogSchema.shape.value),
    date: zDate().pipe(odometerLogSchema.shape.date),
    conversionFactor: odometerUnitSchema.shape.conversionFactor // hidden
});

export type OdometerChangeLogFormFields = z.infer<ReturnType<typeof odometerChangeLogForm>>;

export const useCreateOdometerChangeLogFormProps = (car: Car | null) => {
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

    return { defaultValues, resolver: zodResolver(odometerChangeLogForm(car?.odometer.value)) };
};

export const useEditOdometerChangeLogFormProps = (odometerLog: OdometerLog) => {
    const defaultValues: Partial<OdometerChangeLogFormFields> = {
        id: odometerLog.id,
        odometerChangeLogId: odometerLog.relatedId,
        carId: odometerLog.carId,
        value: odometerLog.value,
        note: odometerLog.note,
        date: odometerLog.date,
        conversionFactor: odometerLog.unit.conversionFactor
    };

    return { defaultValues, resolver: zodResolver(odometerChangeLogForm(0).omit({ ownerId: true })) };
};