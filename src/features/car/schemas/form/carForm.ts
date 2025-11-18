import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, carSchema } from "../carSchema.ts";
import { modelSchema } from "../modelSchema.ts";
import { zNumber, zPickerRequired } from "../../../../types/zodTypes.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { currencySchema } from "../../../_shared/currency/schemas/currencySchema.ts";
import { odometerChangeLogForm } from "../../_features/odometer/schemas/form/odometerChangeLogForm.ts";
import { UserAccount } from "../../../user/schemas/userSchema.ts";

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
    odometer: odometerChangeLogForm(0)
    .pick({ id: true, value: true })
    .extend({
        odometerChangeLogId: odometerChangeLogForm(0).shape.odometerChangeLogId.nullable(),
        unitId: zPickerRequired("Kérem válasszon ki egy mértékegységet!")
        .pipe(carSchema.shape.odometer.shape.unit.shape.id)
    }),
    currencyId: currencySchema.shape.id,
    fuelTank: carSchema.shape.fuelTank.pick({ id: true }).extend({
        typeId: zPickerRequired("Kérem válasszon ki egy üzemanyag típust!")
        .pipe(carSchema.shape.fuelTank.shape.type.shape.id),
        capacity: zNumber({ bounds: { min: 0 } }).pipe(carSchema.shape.fuelTank.shape.capacity),
        unitId: zPickerRequired("Kérem válasszon ki egy mértékegységet!")
        .pipe(carSchema.shape.fuelTank.shape.unit.shape.id)
    })
});

export type CarFormFields = z.infer<typeof carFormSchema>;

export const useCreatCarFormProps = (user: UserAccount) => {
    const defaultValues: CarFormFields = {
        id: getUUID(),
        ownerId: user.id,
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
            odometerChangeLogId: getUUID(),
            value: NaN,
            unitId: ""
        },
        currencyId: user.currency.id,
        fuelTank: {
            id: getUUID(),
            typeId: "",
            unitId: "",
            capacity: NaN
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
            odometerChangeLogId: null, // not changeable by car
            value: car.odometer.value,
            unitId: car.odometer.unit.id
        },
        currencyId: car.currency.id,
        fuelTank: {
            id: car.fuelTank.id,
            typeId: car.fuelTank.type.id,
            unitId: car.fuelTank.unit.id,
            capacity: car.fuelTank.capacity
        }
    };

    return { defaultValues, resolver: zodResolver(carFormSchema) };
};