import { z } from "zod";
import { passengerSchema } from "../passengerSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { RidePassenger } from "../ridePassengerSchema.ts";

export const ridePassengerForm = z.object({
    id: z.string().uuid(),
    passengerId: passengerSchema.shape.id,
    name: passengerSchema.shape.name //hidden
});

export type RidePassengerFormFields = z.infer<typeof ridePassengerForm>;

export function useRidePassengerFormProps(ridePassenger?: RidePassenger) {
    const defaultValues: RidePassengerFormFields = {
        id: ridePassenger?.id ?? getUUID(),
        passengerId: ridePassenger?.passengerId ?? null,
        name: ridePassenger?.name ?? ""
    };

    return { defaultValues, resolver: zodResolver(ridePassengerForm) };
}