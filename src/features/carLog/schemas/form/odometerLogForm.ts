import { odometerLogSchema } from "../odometerLogSchema.ts";
import { zNumber, zPickerRequired } from "../../../../types/zodTypes.ts";
import { z } from "zod";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { Car } from "../../../car/schemas/carSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";

export const odometerLogForm = odometerLogSchema
.pick({ id: true, car_id: true, note: true })
.extend({
    value: zNumber(0).pipe(odometerLogSchema.shape.value),
    unit: zPickerRequired("Kérem válasszon ki egy mértékegységet!").pipe(odometerLogSchema.shape.unit),
    date: z.date().transform(v => v.toISOString()).pipe(odometerLogSchema.shape.date)
});

export type OdometerLogFields = z.infer<typeof odometerLogForm>;

export const useCreateOdometerLogFormProps = (car: Car) => {
    const defaultValues: OdometerLogFields = {
        id: getUUID(),
        car_id: car.id,
        value: car.odometer.value,
        unit: car.odometer.measurement,
        note: null,
        date: new Date() //TODO remove after implemented date picker
    };

    return { defaultValues, resolver: zodResolver(odometerLogForm) };
};