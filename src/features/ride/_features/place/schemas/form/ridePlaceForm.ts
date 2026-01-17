import { z } from "zod";
import { placeSchema } from "../placeSchema.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { zPickerRequiredString } from "../../../../../../types/zodTypes.ts";

export const ridePlaceForm = z.object({
    id: z.string().uuid(),
    placeId: zPickerRequiredString().pipe(placeSchema.shape.id),
    name: placeSchema.shape.name // hidden
});

export type RidePlaceFormFields = z.infer<typeof ridePlaceForm>;
export type RidePlaceFormDefaultValues = z.input<typeof ridePlaceForm>;

export function useRidePlaceFormProps(ridePlace?: RidePlaceFormFields | null) {
    const defaultValues: RidePlaceFormDefaultValues = {
        id: ridePlace?.id ?? getUUID(),
        placeId: ridePlace?.placeId ?? null,
        name: ridePlace?.name ?? ""
    };

    return { defaultValues, resolver: zodResolver(ridePlaceForm) };
}