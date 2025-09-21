import { odometerLogSchema } from "../odometerLogSchema.ts";
import { zNumber, zPickerRequired } from "../../../../types/zodTypes.ts";
import { z } from "zod";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { Car } from "../../../car/schemas/carSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { OdometerLogType } from "../../model/enums/odometerLogType.ts";

const odometerLogForm = (highestOdometerValue: number) => odometerLogSchema
.pick({ id: true, car_id: true, type: true, note: true })
.extend({
    value: zNumber(
        { min: highestOdometerValue },
        { minBound: (min) => `Visszafelé nem pöröghet a kilométeróra, a jelenlegi állás ${ min }.` }
    ).pipe(odometerLogSchema.shape.value),
    unit: zPickerRequired("Kérem válasszon ki egy mértékegységet!").pipe(odometerLogSchema.shape.unit),
    date: z.date().transform(v => v.toISOString()).pipe(odometerLogSchema.shape.date)
});

export type OdometerLogFields = z.infer<typeof odometerLogForm>;

export const useCreateOdometerLogFormProps = (car: Car) => {
    const defaultValues: OdometerLogFields = {
        id: getUUID(),
        car_id: car.id,
        type: OdometerLogType.SIMPLE,
        value: car.odometer.value,
        unit: car.odometer.measurement,
        note: null,
        date: new Date()
    };

    return { defaultValues, resolver: zodResolver(odometerLogForm(car.odometer.value)) };
};