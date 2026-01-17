import { z } from "zod";
import { zNumber, ZodNumberErrorMessage, zPickerRequiredNumber } from "../../../../types/zodTypes.ts";
import { currencySchema } from "./currencySchema.ts";

type InputAmountSchemaOptions = {
    minAmount?: number
    minExchangeRate?: number
    amountErrorMessage?: ZodNumberErrorMessage
    exchangeRateErrorMessage?: ZodNumberErrorMessage
}
//
// const baseInputAmountSchema = ({
//     minAmount = 0,
//     minExchangeRate = 0,
//     amountErrorMessage = {},
//     exchangeRateErrorMessage = {}
// }: InputAmountSchemaOptions) => z
//     .object({
//         currencyId: zPickerRequiredNumber("error.currency_picker_required").pipe(currencySchema.shape.id),
//         amount: zNumber({
//             bounds: { min: minAmount ?? 0 },
//             errorMessage: {
//                 required: "error.expense_amount_required",
//                 minBound: (min) => min === 0
//                                    ? "error.expense_amount_non_negative"
//                                    : `error.expense_amount_min_limit;${ min }`,
//                 ...amountErrorMessage
//             }
//         }),
//         exchangeRate: zNumber({
//             bounds: { min: minExchangeRate ?? 0 },
//             errorMessage: {
//                 required: "error.exchange_rate_required",
//                 minBound: (min) => !min || min <= 0
//                                    ? "error.exchange_rate_non_negative"
//                                    : `error.exchange_rate_min_limit;${ min }`,
//                 ...exchangeRateErrorMessage
//             }
//         })
//     });

export const inputAmountSchema = ({
    minAmount = 0,
    minExchangeRate = 0,
    amountErrorMessage = {},
    exchangeRateErrorMessage = {}
}: InputAmountSchemaOptions = {}) => z
.object({
    currencyId: zPickerRequiredNumber({ errorMessage: "error.currency_picker_required" }).pipe(currencySchema.shape.id),
    amount: zNumber({
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
        bounds: { min: minExchangeRate ?? 0 },
        errorMessage: {
            required: "error.exchange_rate_required",
            minBound: (min) => !min || min <= 0
                               ? "error.exchange_rate_non_negative"
                               : `error.exchange_rate_min_limit;${ min }`,
            ...exchangeRateErrorMessage
        }
    })
});

type InputAmountWithQuantitySchemaOptions = {
    minQuantity?: number
    quantityErrorMessage?: ZodNumberErrorMessage
}

export const inputAmountWithQuantity = ({
    minQuantity,
    quantityErrorMessage
}: InputAmountWithQuantitySchemaOptions) => z.object({
    quantity: zNumber({
        bounds: { min: minQuantity ?? 0 },
        errorMessage: {
            required: "error.quantity_required",
            minBound: () => "error.quantity_non_negative",
            ...quantityErrorMessage
        }
    })
});

type InputAmountWithIsPricePerUnitSchemaOptions = {
    defaultIsPricePerUnit: boolean
}

export const inputAmountWithIsPricePerUnit = ({
    defaultIsPricePerUnit = false
}: InputAmountWithIsPricePerUnitSchemaOptions) => z.object({
    isPricePerUnit: z.boolean().default(defaultIsPricePerUnit)
});