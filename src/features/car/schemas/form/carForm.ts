import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, carSchema } from "../carSchema.ts";
import { modelSchema } from "../modelSchema.ts";
import { zNumber, zPickerRequired } from "../../../../types/zodTypes.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";

export const carFormSchema = carSchema
.pick({ id: true, ownerId: true, name: true, image: true })
.extend({
    model: z.object({
        id: zPickerRequired("Válasszon ki egy modellt!").pipe(modelSchema.shape.id),
        name: z.string().optional(), // hidden input only for result screen
        makeId: zPickerRequired("Válasszon ki egy gyártót!").pipe(modelSchema.shape.makeId),
        makeName: z.string().optional(), // hidden input only for result screen
        year: zPickerRequired("Válasszon ki egy gyártási évet!").pipe(modelSchema.shape.startYear)
    }),
    odometer: carSchema.shape.odometer.pick({ id: true }).extend({
        value: zNumber(0, 0).pipe(carSchema.shape.odometer.shape.value),
        measurement: zPickerRequired("Kérem válasszon ki egy mértékegységet!")
        .pipe(carSchema.shape.odometer.shape.measurement)
    }),
    fuelTank: carSchema.shape.fuelTank.pick({ id: true }).extend({
        type: zPickerRequired("Kérem válasszon ki egy üzemanyag típust!").pipe(carSchema.shape.fuelTank.shape.type),
        capacity: zNumber(0, 0).pipe(carSchema.shape.fuelTank.shape.capacity),
        value: zNumber(0, 0).pipe(carSchema.shape.fuelTank.shape.value),
        measurement: zPickerRequired("Kérem válasszon ki egy mértékegységet!")
        .pipe(carSchema.shape.fuelTank.shape.measurement)
    })
});

export type CarFormFields = z.infer<typeof carFormSchema>;

export const useCreatCarFormProps = (userId: string) => {
    const defaultValues: CarFormFields = {
        id: getUUID(),
        ownerId: userId,
        name: "",
        image: null,
        model: {
            id: "",
            name: "",
            makeId: "",
            makeName: "",
            year: ""
        },
        odometer: {
            id: getUUID(),
            value: NaN,
            measurement: ""
        },
        fuelTank: {
            id: getUUID(),
            type: "",
            capacity: NaN,
            value: 0,
            measurement: ""
        }
    };

    return { defaultValues, resolver: zodResolver(carFormSchema) };
};

export const useEditCarFormProps = (car: Car) => {
    const defaultValues: CarFormFields = {
        id: car.id,
        ownerId: car.ownerId,
        name: car.name,
        image: car.image,
        model: {
            id: car.model.id,
            name: car.model.name,
            makeId: car.model.make.id,
            makeName: car.model.make.name,
            year: car.model.year
        },
        odometer: {
            id: car.odometer.id,
            value: car.odometer.value,
            measurement: car.odometer.measurement
        },
        fuelTank: {
            id: car.fuelTank.id,
            type: car.fuelTank.type,
            capacity: car.fuelTank.capacity,
            value: car.fuelTank.value,
            measurement: car.fuelTank.measurement
        }
    };

    return { defaultValues, resolver: zodResolver(carFormSchema) };
};