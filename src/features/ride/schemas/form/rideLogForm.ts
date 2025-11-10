import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { rideLogSchema } from "../rideLogSchema.ts";
import { odometerSchema } from "../../../car/_features/odometer/schemas/odometerSchema.ts";
import { zDate, zNumber } from "../../../../types/zodTypes.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { Car } from "../../../car/schemas/carSchema.ts";
import { ridePlaceForm } from "../../_features/place/schemas/form/ridePlaceForm.ts";
import { ridePassengerForm } from "../../_features/passenger/schemas/form/ridePassengerForm.ts";
import { formResultRideExpenseSchema } from "../../_features/rideExpense/schemas/rideExpenseSchema.ts";
import { userSchema } from "../../../user/schemas/userSchema.ts";

const rideLogForm = rideLogSchema
.pick({ id: true, carId: true, note: true })
.extend({
    startTime: zDate({ optional: true }).pipe(rideLogSchema.shape.startTime),
    endTime: zDate({ optional: true }).pipe(rideLogSchema.shape.endTime),
    startOdometerLogId: odometerSchema.shape.id, // hidden
    startOdometerValue: zNumber({
        optional: true,
        bounds: { min: 0 },
        errorMessage: {
            minBound: (min) =>
                min === 0
                ? "A kilométeróra-állás nem lehet negatív szám"
                : `Visszafelé nem pöröghet a kilométeróra, a jelenlegi állás ${ min }.`
        }
    }),
    endOdometerLogId: odometerSchema.shape.id, // hidden
    endOdometerValue: zNumber({
        optional: true,
        bounds: { min: 0 },
        errorMessage: {
            minBound: (min) =>
                min === 0
                ? "A kilométeróra-állás nem lehet negatív szám"
                : `Visszafelé nem pöröghet a kilométeróra, a jelenlegi állás ${ min }.`
        }
    }),
    expenses: z.array(formResultRideExpenseSchema),
    places: z.array(ridePlaceForm),
    passengers: z.array(ridePassengerForm),
    ownerId: userSchema.shape.id //hidden
});

export type RideLogFormFields = z.infer<typeof rideLogForm>;

export function useCreateRideLogFormProps(car: Car | null) {
    const defaultValues: RideLogFormFields = {
        id: getUUID(),
        ownerId: car?.ownerId,
        carId: car?.id,
        startOdometerLogId: getUUID(),
        startOdometerValue: NaN,
        endOdometerLogId: getUUID(),
        endOdometerValue: NaN,
        expenses: [],
        places: [],
        passengers: [],
        startTime: null,
        endTime: null,
        note: null
    };

    return { defaultValues, resolver: zodResolver(rideLogForm) };
}