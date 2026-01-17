import { serviceItemSchema } from "../serviceItemSchema.ts";
import { zPickerRequiredString } from "../../../../../../types/zodTypes.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CurrencyEnum } from "../../../../../_shared/currency/enums/currencyEnum.ts";
import {
    inputAmountSchema,
    inputAmountWithQuantity
} from "../../../../../_shared/currency/schemas/inputAmountSchema.ts";
import { DefaultValues, UseFormProps } from "react-hook-form";

export const serviceItemForm = serviceItemSchema
.pick({ id: true })
.extend({
    typeId: zPickerRequiredString({ errorMessage: "error.type_picker_required" })
    .pipe(serviceItemSchema.shape.type.shape.id),
    expense:
        inputAmountSchema({
            minAmount: serviceItemSchema.shape.pricePerUnit.shape.amount.minValue ?? 0,
            amountErrorMessage:
                {
                    required: "error.price_per_unit_required",
                    minBound:
                        (min) => !min || min <= 0
                                 ? "error.price_per_unit_non_negative"
                                 : `error.price_per_unit_min_limit;${ min }`
                }
        })
        .extend(
            inputAmountWithQuantity({
                minQuantity: serviceItemSchema.shape.quantity.minValue ?? 1
            }).shape
        )
});

export const transformedServiceItemForm = serviceItemSchema.omit({ carId: true, serviceLogId: true });

export type ServiceItemFormTransformedFields = z.infer<typeof transformedServiceItemForm>;
export type ServiceItemFormFields = z.infer<typeof serviceItemForm>;

export function useServiceItemFormProps({ carCurrencyId, serviceItem }: {
    carCurrencyId?: number,
    serviceItem?: ServiceItemFormTransformedFields | null
}): UseFormProps<ServiceItemFormFields> {
    const defaultValues: DefaultValues<ServiceItemFormFields> = {
        id: serviceItem?.id ?? getUUID(),
        typeId: serviceItem?.type?.id,
        expense: {
            currencyId: serviceItem?.pricePerUnit?.currency?.id ?? carCurrencyId ?? CurrencyEnum.EUR,
            quantity: serviceItem?.quantity ?? 1,
            amount: serviceItem?.pricePerUnit?.amount,
            exchangeRate: serviceItem?.pricePerUnit?.exchangeRate ?? 1
        }
    };

    return { defaultValues, resolver: zodResolver(serviceItemForm) };
}