import { serviceItemSchema } from "../serviceItemSchema.ts";
import { zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";

export const serviceItemForm = serviceItemSchema
.pick({ id: true })
.extend({
    typeId: zPickerRequired("Kérem válasszon ki egy típust!").pipe(serviceItemSchema.shape.type.shape.id),
    currencyId: zPickerRequired("Kérem válasszon ki egy valutát!")
    .pipe(serviceItemSchema.shape.pricePerUnit.shape.currency.shape.id),
    quantity: zNumber({
        bounds: { min: serviceItemSchema.shape.quantity.minValue ?? 0 },
        errorMessage: {
            required: "Kérem adja meg tétel darabszámát",
            minBound: (min) =>
                min === 0
                ? "A tétel darabszáma nem lehet negatív szám."
                : `A tétel darabszámának minimum ${ min } értékűnek kell lennie.`
        }
    }).pipe(serviceItemSchema.shape.quantity),
    pricePerUnit: zNumber({
        bounds: { min: serviceItemSchema.shape.pricePerUnit.shape.amount.minValue ?? 0 },
        errorMessage: {
            required: "Kérem adja meg az egységárat",
            minBound: (min) => min === 0
                               ? "Az egységár nem lehet negatív szám."
                               : `Az egységárnak minimum ${ min } értékűnek kell lennie.`
        }
    }).pipe(serviceItemSchema.shape.pricePerUnit.shape.amount),
    exchangeRate: zNumber({
        bounds: { min: serviceItemSchema.shape.pricePerUnit.shape.exchangeRate.minValue ?? 0 },
        errorMessage: {
            required: "Kérem adja meg az átváltási árfolyamot.",
            minBound: (min) => min === 0
                               ? "Az átváltási árfolyam nem lehet negatív szám."
                               : `Az átváltási árfolyamnak minimum legyen legalább ${ min }.`
        }
    }).pipe(serviceItemSchema.shape.pricePerUnit.shape.exchangeRate)
});