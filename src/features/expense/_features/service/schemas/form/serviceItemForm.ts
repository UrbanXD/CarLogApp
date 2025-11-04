import { ServiceItem, serviceItemSchema } from "../serviceItemSchema.ts";
import { zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CurrencyEnum } from "../../../../../_shared/currency/enums/currencyEnum.ts";

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

export type ServiceItemFields = z.infer<typeof serviceItemForm>;

export function useServiceItemFormProps({ carCurrencyId, serviceItem }: {
    carCurrencyId?: number,
    serviceItem?: ServiceItem
}) {
    const defaultValues: ServiceItemFields = {
        id: serviceItem?.id ?? getUUID(),
        typeId: serviceItem?.type?.id ?? null,
        currencyId: serviceItem?.pricePerUnit?.currency?.id ?? carCurrencyId ?? CurrencyEnum.EUR,
        quantity: serviceItem?.quantity ?? 1,
        pricePerUnit: serviceItem?.pricePerUnit?.amount ?? 0,
        exchangeRate: serviceItem?.pricePerUnit?.exchangeRate ?? 1
    };

    return { defaultValues, resolver: zodResolver(serviceItemForm) };
}