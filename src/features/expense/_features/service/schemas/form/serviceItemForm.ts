import { serviceItemSchema } from "../serviceItemSchema.ts";
import { zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { fuelLogSchema } from "../../../../../car/_features/fuel/schemas/fuelLogSchema.ts";

export const serviceItemForm = serviceItemSchema
.pick({ id: true })
.extend({
    typeId: zPickerRequired("Kérem válasszon ki egy típust!").pipe(serviceItemSchema.shape.type.shape.id),
    quantity: zNumber({
        bounds: { min: fuelLogSchema.shape.quantity.minValue ?? 0 },
        errorMessage: {
            required: "Kérem adja meg tétel darabszámát",
            minBound: (min) =>
                min === 0
                ? "A tétel darabszáma nem lehet negatív szám."
                : `A tétel darabszámának minimum ${ min } értékűnek kell lennie.`
        }
    }).pipe(serviceItemSchema.shape.quantity),
    pricePerUnit: zNumber({
        bounds: { min: serviceItemSchema.shape.pricePerUnit.minValue ?? 0 },
        errorMessage: {
            required: "Kérem adja meg az egységárat",
            minBound: (min) => min === 0
                               ? "Az egységár nem lehet negatív szám."
                               : `Az egységárnak minimum ${ min } értékűnek kell lennie.`
        }
    }).pipe(serviceItemSchema.shape.pricePerUnit)
});
