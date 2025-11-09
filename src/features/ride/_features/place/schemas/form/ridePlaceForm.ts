import { z } from "zod";
import { placeSchema } from "../placeSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { RidePlace } from "../ridePlaceSchema.ts";

export const ridePlaceForm = z.object({
    id: z.string().uuid(),
    placeId: placeSchema.shape.id,
    name: placeSchema.shape.name // hidden
});

export type RidePlaceFormFields = z.infer<typeof ridePlaceForm>;

export function useRidePlaceFormProps(ridePlace?: RidePlace) {
    const defaultValues: RidePlaceFormFields = {
        id: ridePlace?.id ?? getUUID(),
        placeId: ridePlace?.placeId ?? null,
        name: ridePlace?.name ?? ""
    };

    return { defaultValues, resolver: zodResolver(ridePlaceForm) };
}