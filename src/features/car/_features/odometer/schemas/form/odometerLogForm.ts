import { OdometerLog, odometerLogSchema } from "../odometerLogSchema.ts";
import { zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { z } from "zod";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { Car } from "../../../../schemas/carSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { OdometerLogType } from "../../model/enums/odometerLogType.ts";
import { odometerUnitSchema } from "../odometerUnitSchema.ts";

const odometerLogForm = (highestOdometerValue?: number = 0) => odometerLogSchema
.pick({ id: true, type: true, note: true })
.extend({
    carId: zPickerRequired("Kérem válasszon ki egy autót!").pipe(odometerLogSchema.shape.carId),
    value: zNumber(
        { min: highestOdometerValue },
        {
            minBound: (min) => min === 0
                               ? "A kilométeróra-állás nem lehet negatív szám"
                               : `Visszafelé nem pöröghet a kilométeróra, a jelenlegi állás ${ min }.`
        }
    ).pipe(odometerLogSchema.shape.value),
    date: z.date({ required_error: "Kérem válasszon ki egy dátumot!" }).transform(v => v.toISOString()).pipe(
        odometerLogSchema.shape.date),
    conversionFactor: odometerUnitSchema.shape.conversionFactor // hidden
});

export type OdometerLogFields = z.infer<ReturnType<typeof odometerLogForm>>;

export const useCreateOdometerLogFormProps = (car: Car | null) => {
    const defaultValues: OdometerLogFields = {
        id: getUUID(),
        carId: car?.id,
        type: OdometerLogType.SIMPLE,
        value: car?.odometer.value,
        note: null,
        date: new Date(),
        conversionFactor: car?.odometer.unit.conversionFactor ?? 1
    };

    return { defaultValues, resolver: zodResolver(odometerLogForm(car?.odometer.value)) };
};

export const useEditOdometerLogFormProps = (odometerLog: OdometerLog) => {
    const defaultValues: OdometerLogFields = {
        id: odometerLog.id,
        carId: odometerLog.carId,
        type: odometerLog.type,
        value: odometerLog.value,
        note: odometerLog.note,
        date: odometerLog.date,
        conversionFactor: odometerLog.unit.conversionFactor
    };

    return { defaultValues, resolver: zodResolver(odometerLogForm(0)) };
};