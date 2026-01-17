import { z } from "zod";
import { passengerSchema } from "../passengerSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";

export const ridePassengerForm = z.object({
    id: z.string().uuid(),
    passengerId: z
    .string()
    .uuid()
    .nullable() // Engedi a null-t az inputban (defaultValues)
    .refine((val) => val !== null, {
        message: "Passenger is required"
    }).pipe(passengerSchema.shape.id),
    name: passengerSchema.shape.name //hidden
});

export type RidePassengerFormFields = z.infer<typeof ridePassengerForm>;
export type RidePassengerDefaultValues = z.input<typeof ridePassengerForm>;

export function useRidePassengerFormProps(ridePassenger?: RidePassengerFormFields | null) {
    const defaultValues: RidePassengerDefaultValues = {
        id: ridePassenger?.id ?? getUUID(),
        passengerId: ridePassenger?.passengerId ?? null,
        name: ridePassenger?.name ?? ""
    };

    return { defaultValues, resolver: zodResolver(ridePassengerForm) };
}