import { ServiceItem, serviceItemSchema } from "../serviceItemSchema.ts";
import { zPickerRequired } from "../../../../../../types/zodTypes.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CurrencyEnum } from "../../../../../_shared/currency/enums/currencyEnum.ts";
import { inputAmountSchema } from "../../../../../_shared/currency/schemas/inputAmountSchema.ts";

export const serviceItemForm = serviceItemSchema
.pick({ id: true })
.extend({
    typeId: zPickerRequired("error.type_picker_required").pipe(serviceItemSchema.shape.type.shape.id),
    expense: inputAmountSchema({
        minAmount: serviceItemSchema.shape.pricePerUnit.shape.amount.minValue ?? 0,
        minQuantity: serviceItemSchema.shape.quantity.minValue ?? 1,
        withQuantity: true,
        amountErrorMessage: {
            required: "error.price_per_unit_required",
            minBound: (min) => min <= 0
                               ? "error.price_per_unit_non_negative"
                               : `error.price_per_unit_min_limit;${ min }`
        }
    })
});

export type ServiceItemFields = z.infer<typeof serviceItemForm>;

export function useServiceItemFormProps({ carCurrencyId, serviceItem }: {
    carCurrencyId?: number,
    serviceItem?: ServiceItem
}) {
    const defaultValues: ServiceItemFields = {
        id: serviceItem?.id ?? getUUID(),
        typeId: serviceItem?.type?.id ?? null,
        expense: {
            currencyId: serviceItem?.pricePerUnit?.currency?.id ?? carCurrencyId ?? CurrencyEnum.EUR,
            quantity: serviceItem?.quantity ?? 1,
            pricePerUnit: serviceItem?.pricePerUnit?.amount ?? 0,
            exchangeRate: serviceItem?.pricePerUnit?.exchangeRate ?? 1
        }
    };

    return { defaultValues, resolver: zodResolver(serviceItemForm) };
}