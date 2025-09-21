import { odometerLogSchema } from "../odometerLogSchema.ts";
import { zNumber, zPickerRequired } from "../../../../types/zodTypes.ts";
import { z } from "zod";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { Car } from "../carSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { OdometerLogType } from "../../model/enums/odometerLogType.ts";

const odometerLogForm = (highestOdometerValue?: number = 0) => odometerLogSchema
.pick({ id: true, type: true, note: true })
.extend({
    car_id: zPickerRequired("Kérem válasszon ki egy autót!").pipe(odometerLogSchema.shape.car_id),
    value: zNumber(
        { min: highestOdometerValue },
        {
            minBound: (min) => min === 0
                               ? "A kilométeróra-állás nem lehet negatív szám"
                               : `Visszafelé nem pöröghet a kilométeróra, a jelenlegi állás ${ min }.`
        }
    ).pipe(odometerLogSchema.shape.value),
    unit: zPickerRequired("Kérem válasszon ki egy mértékegységet!").pipe(odometerLogSchema.shape.unit),
    date: z.date({ required_error: "Kérem válasszon ki egy dátumot!" }).transform(v => v.toISOString()).pipe(
        odometerLogSchema.shape.date)
});

export type OdometerLogFields = z.infer<typeof odometerLogForm>;

export const useCreateOdometerLogFormProps = (car?: Car) => {
    console.log("faf", car?.odometer.value);
    const defaultValues: OdometerLogFields = {
        id: getUUID(),
        car_id: car?.id,
        type: OdometerLogType.SIMPLE,
        value: car?.odometer.value,
        unit: car?.odometer.measurement,
        note: null,
        date: new Date()
    };

    return { defaultValues, resolver: zodResolver(odometerLogForm(car?.odometer.value)) };
};