import { Passenger, passengerSchema } from "../passengerSchema.ts";
import { PassengerDao } from "../../model/dao/passengerDao.ts";
import { z } from "zod";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";

const passengerForm = passengerSchema
.pick({ id: true, ownerId: true })
.extend({
    name: passengerSchema.shape.name.min(1, "Az utas nevének megadása kötelező.")
});

const getPassengerForm = (passengerDao: PassengerDao) => passengerForm
.refine(
    async (value) => {
        return await passengerDao.isNameAlreadyExists(value.id, value.ownerId, value.name);
    },
    {
        message: "Már létezik ilyen nevű utas.",
        path: ["name"]
    }
);

export type PassengerFormFields = z.infer<typeof passengerForm>;

export function useCreatePassengerFormProps(passengerDao: PassengerDao, ownerId: string) {
    const defaultValues: PassengerFormFields = {
        id: getUUID(),
        ownerId,
        name: ""
    };

    return { defaultValues, resolver: zodResolver(getPassengerForm(passengerDao)) };
}

export function useEditPassengerFormProps(passengerDao: PassengerDao, passenger: Passenger) {
    const defaultValues: PassengerFormFields = {
        id: passenger.id,
        ownerId: passenger.ownerId,
        name: passenger.name
    };

    return { defaultValues, resolver: zodResolver(getPassengerForm(passengerDao)) };
}