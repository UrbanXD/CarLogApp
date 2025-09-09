import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { carSchema } from "../carSchema.ts";
import { modelSchema } from "../modelSchema.ts";

const createCarRequestSchema = carSchema
.pick({ ownerId: true, name: true, image: true })
.extend({
    model: carSchema.shape.model.pick({ id: true }).extend({
        makeId: modelSchema.shape.makeId,
        year: modelSchema.shape.startYear
    }),
    odometer: carSchema.shape.odometer.omit({ id: true }),
    fuelTank: carSchema.shape.fuelTank.omit({ id: true })
});

export type CreateCarRequest = z.infer<typeof createCarRequestSchema>;

export const useCreatCarFormProps = () => {
    const defaultValues: CreateCarRequest = {
        ownerId: "",
        name: "",
        image: null,
        model: { makeId: "", id: "", year: "" },
        odometer: { value: 0, measurement: "" },
        fuelTank: { type: "", capacity: 0, value: 0, measurement: "" }
    };

    return { defaultValues, resolver: zodResolver(createCarRequestSchema) };
};