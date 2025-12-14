import { z } from "zod";
import { zNumber, ZodNumberErrorMessage, zPickerRequired } from "../../../../types/zodTypes.ts";

type InputAmountSchemaArgs = {
    minAmount?: number
    minExchangeRate?: number
    optionalAmount?: boolean
    withQuantity?: boolean
    minQuantity?: number
    optionalQuantity?: boolean
    withIsPricePerUnit?: boolean
    defaultIsPricePerUnit?: boolean
    amountErrorMessage?: ZodNumberErrorMessage
    exchangeRateErrorMessage?: ZodNumberErrorMessage
    quantityErrorMessage?: ZodNumberErrorMessage
}

export const inputAmountSchema = ({
    minAmount = 0,
    minExchangeRate = 0,
    optionalAmount = false,
    withQuantity = false,
    minQuantity = 0,
    optionalQuantity = false,
    withIsPricePerUnit = false,
    defaultIsPricePerUnit = false,
    amountErrorMessage = {},
    exchangeRateErrorMessage = {},
    quantityErrorMessage = {}
}: InputAmountSchemaArgs) => {
    let schema = z.object({
        currencyId: zPickerRequired("error.currency_picker_required"),
        amount: zNumber({
            optional: optionalAmount,
            bounds: { min: minAmount ?? 0 },
            errorMessage: {
                required: "error.expense_amount_required",
                minBound: (min) => min === 0
                                   ? "error.expense_amount_non_negative"
                                   : `error.expense_amount_min_limit;${ min }`,
                ...amountErrorMessage
            }
        }),
        exchangeRate: zNumber({
            optional: optionalAmount,
            bounds: { min: minExchangeRate ?? 0 },
            errorMessage: {
                required: "error.exchange_rate_required",
                minBound: (min) => min <= 0
                                   ? "error.exchange_rate_non_negative"
                                   : `error.exchange_rate_min_limit;${ min }`,
                ...exchangeRateErrorMessage
            }
        })
    });

    if(withQuantity) {
        schema = schema.extend({
            quantity: zNumber({
                optional: optionalQuantity,
                bounds: { min: minQuantity ?? 0 },
                errorMessage: {
                    required: "error.quantity_required",
                    minBound: () => "error.quantity_non_negative",
                    ...quantityErrorMessage
                }
            })
        });
    }

    if(withIsPricePerUnit) {
        schema = schema.extend({
            isPricePerUnit: z.boolean().default(defaultIsPricePerUnit)
        });
    }

    return schema;
};