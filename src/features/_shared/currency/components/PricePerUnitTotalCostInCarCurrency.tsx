import { Trans } from "react-i18next";
import { Text } from "react-native";
import React from "react";

type PricePerUnitTotalCostInCarCurrencyProps = {
    amountText: string
    carAmountText?: string
}

export function PricePerUnitTotalCostInCarCurrency({
    amountText,
    carAmountText
}: PricePerUnitTotalCostInCarCurrencyProps) {
    return (
        <Trans
            i18nKey={
                carAmountText
                ? "currency.price_per_unit_based_on_total_cost"
                : "currency.price_per_unit_based_on_total_cost_in_car_currency"
            }
            values={ { amount: amountText, carAmount: carAmountText } }
            parent={ Text }
            components={ {
                amount: <Text style={ { fontWeight: "bold" } }/>
            } }
        />
    );
}