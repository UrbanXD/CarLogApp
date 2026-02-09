import { Trans } from "react-i18next";
import { Text } from "react-native";
import React from "react";

type AmountInCarCurrencyProps = {
    amountText: string
    isPricePerUnit?: boolean
}

export function AmountInCarCurrency({
    amountText,
    isPricePerUnit = false
}: AmountInCarCurrencyProps) {
    return (
        <Trans
            i18nKey={ isPricePerUnit ? "currency.price_per_unit_in_car_currency" : "currency.cost_in_car_currency" }
            values={ { amount: amountText } }
            parent={ Text }
            components={ {
                amount: <Text style={ { fontWeight: "bold" } }/>
            } }
        />
    );
}