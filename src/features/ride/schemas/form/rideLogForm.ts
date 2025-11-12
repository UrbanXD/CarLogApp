import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RideLog, rideLogSchema } from "../rideLogSchema.ts";
import { odometerSchema } from "../../../car/_features/odometer/schemas/odometerSchema.ts";
import { zDate, zNumber } from "../../../../types/zodTypes.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { Car } from "../../../car/schemas/carSchema.ts";
import { ridePlaceForm } from "../../_features/place/schemas/form/ridePlaceForm.ts";
import { ridePassengerForm } from "../../_features/passenger/schemas/form/ridePassengerForm.ts";
import { formResultRideExpenseSchema } from "../../_features/rideExpense/schemas/rideExpenseSchema.ts";

const rideLogForm = rideLogSchema
.pick({ id: true, carId: true, note: true })
.extend({
    startTime: zDate().pipe(rideLogSchema.shape.startTime),
    endTime: zDate().pipe(rideLogSchema.shape.endTime),
    startOdometerLogId: odometerSchema.shape.id, // hidden
    startOdometerValue: zNumber({
        optional: false,
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
        bounds: { min: 0 },
        errorMessage: {
            minBound: (min) =>
                min === 0
                ? "A kilométeróra-állás nem lehet negatív szám"
                : `Visszafelé nem pöröghet a kilométeróra, a jelenlegi állás ${ min }.`
        }
    }),
    expenses: z.array(formResultRideExpenseSchema),
    places: z.array(ridePlaceForm).min(2, {
        message: "Legalább meg kell adnia az indulási és érkezési helyet."
    }),
    passengers: z.array(ridePassengerForm)
})
.superRefine((data, ctx) => {
    if(data.endTime && data.startTime && data.endTime < data.startTime) {
        ctx.addIssue({
            path: ["endTime"],
            message: "Az érkezési időnek későbbinek kell lennie, mint az indulási idő."
        });
    }

    if(data.endOdometerValue <= data.startOdometerValue) {
        ctx.addIssue({
            path: ["endOdometerValue"],
            message: "A kilométeróra-állás nem csökkenhet az induláshoz képest."
        });
    }
});

export type RideLogFormFields = z.infer<typeof rideLogForm>;

export function useCreateRideLogFormProps(car: Car | null) {
    const now = new Date();

    const defaultValues: RideLogFormFields = {
        id: getUUID(),
        carId: car?.id,
        startOdometerLogId: getUUID(),
        startOdometerValue: car?.odometer.value ?? 0,
        endOdometerLogId: getUUID(),
        endOdometerValue: NaN,
        expenses: [],
        places: [],
        passengers: [],
        startTime: now,
        endTime: now,
        note: null
    };

    return { defaultValues, resolver: zodResolver(rideLogForm) };
}

export function useEditRideLogFormProps(rideLog: RideLog, ownerId: string) {
    const defaultValues: RideLogFormFields = {
        id: rideLog.id,
        carId: rideLog.carId,
        ownerId: ownerId,
        startOdometerLogId: rideLog.startOdometer.id,
        startOdometerValue: rideLog.startOdometer.value,
        endOdometerLogId: rideLog.endOdometer.id,
        endOdometerValue: rideLog.endOdometer.value,
        expenses: rideLog.rideExpenses,
        places: rideLog.ridePlaces,
        passengers: rideLog.ridePassengers,
        startTime: rideLog.startTime,
        endTime: rideLog.endTime,
        note: rideLog.note
    };

    return { defaultValues, resolver: zodResolver(rideLogForm) };
}