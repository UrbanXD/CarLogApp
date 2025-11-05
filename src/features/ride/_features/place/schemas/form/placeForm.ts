import { Place, placeSchema } from "../placeSchema.ts";
import { PlaceDao } from "../../model/dao/placeDao.ts";
import { z } from "zod";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";

const placeForm = placeSchema
.pick({ id: true, ownerId: true })
.extend({
    name: placeSchema.shape.name.min(1, "A hely megnevezésének megadása kötelező.")
});

const getPlaceForm = (placeDao: PlaceDao) => placeForm
.refine(
    async (value) => {
        return await placeDao.isNameAlreadyExists(value.id, value.ownerId, value.name);
    },
    {
        message: "Már létezik ilyen nevű helyed.",
        path: ["name"]
    }
);

export type PlaceFormFields = z.infer<typeof placeForm>;

export function useCreatePlaceFormProps(placeDao: PlaceDao, ownerId: string) {
    const defaultValues: PlaceFormFields = {
        id: getUUID(),
        ownerId,
        name: ""
    };

    return { defaultValues, resolver: zodResolver(getPlaceForm(placeDao)) };
}

export function useEditPlaceFormProps(placeDao: PlaceDao, place: Place) {
    const defaultValues: PlaceFormFields = {
        id: place.id,
        ownerId: place.ownerId,
        name: place.name
    };

    return { defaultValues, resolver: zodResolver(getPlaceForm(placeDao)) };
}