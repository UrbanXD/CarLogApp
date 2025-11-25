import { ServiceItem, serviceItemSchema } from "../serviceItemSchema.ts";
import { zNumber, zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CurrencyEnum } from "../../../../../_shared/currency/enums/currencyEnum.ts";

export const serviceItemForm = serviceItemSchema
.pick({ id: true })
.extend({
    typeId: zPickerRequired("error.type_picker_required").pipe(serviceItemSchema.shape.type.shape.id),
    currencyId: zPickerRequired("error.currency_picker_required")
    .pipe(serviceItemSchema.shape.pricePerUnit.shape.currency.shape.id),
    quantity: zNumber({
        bounds: { min: serviceItemSchema.shape.quantity.minValue ?? 1 },
        errorMessage: {
            required: "error.service_item_quantity_required",
            minBound: (min) =>
                min === 0
                ? "error.service_item_quantity_non_negative"
                : `error.service_item_quantity_min_limit;${ min }`
        }
    }).pipe(serviceItemSchema.shape.quantity),
    pricePerUnit: zNumber({
        bounds: { min: serviceItemSchema.shape.pricePerUnit.shape.amount.minValue ?? 0 },
        errorMessage: {
            required: "error.price_per_unit_required",
            minBound: (min) => min === 0
                               ? "error.price_per_unit_non_negative"
                               : `error.price_per_unit_min_limit;${ min }`
        }
    }).pipe(serviceItemSchema.shape.pricePerUnit.shape.amount),
    exchangeRate: zNumber({
        bounds: { min: serviceItemSchema.shape.pricePerUnit.shape.exchangeRate.minValue ?? 0 },
        errorMessage: {
            required: "error.exchange_rate_required",
            minBound: (min) => min === 0
                               ? "error.exchange_rate_non_negative"
                               : `error.exchange_rate_min_limit;${ min }`
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