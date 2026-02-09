import { z } from "zod";
import { carSimpleSchema } from "../../car/schemas/carSchema.ts";
import { odometerSchema } from "../../car/_features/odometer/schemas/odometerSchema.ts";
import { zNote } from "../../../types/zodTypes.ts";
import { ridePassengerSchema } from "../_features/passenger/schemas/ridePassengerSchema.ts";
import { ridePlaceSchema } from "../_features/place/schemas/ridePlaceSchema.ts";
import { rideExpenseSchema } from "../_features/rideExpense/schemas/rideExpenseSchema.ts";

export const rideLogSchema = z
.object({
    id: z.string().uuid(),
    car: carSimpleSchema,
    rideExpenses: z.array(rideExpenseSchema),
    ridePassengers: z.array(ridePassengerSchema),
    ridePlaces: z.array(ridePlaceSchema),
    startOdometer: odometerSchema,
    endOdometer: odometerSchema,
    startTime: z.string(),
    endTime: z.string(),
    note: zNote()
});

export type RideLog = z.infer<typeof rideLogSchema>;