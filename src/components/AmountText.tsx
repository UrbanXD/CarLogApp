import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../constants/index.ts";

type AmountTextProps = {
    amount: string | number
    currencyText: string
    exchangedAmount?: (string | number) | Array<string | number>
    exchangeCurrencyText?: string | Array<string>
    containerStyle?: ViewStyle
    amountTextStyle?: TextStyle
    exchangedAmountTextStyle?: TextStyle
}

export function AmountText({
    amount,
    currencyText,
    exchangedAmount,
    exchangeCurrencyText,
    containerStyle,
    amountTextStyle,
    exchangedAmountTextStyle
}: AmountTextProps) {
    return (
        <View style={ [styles.container, containerStyle] }>
            <Text style={ [styles.text, amountTextStyle] }>
                {
                    amount == 0
                    ? "ingyen"
                    : `${ amount } ${ currencyText }`
                }
            </Text>
            {
                amount !== 0 && exchangedAmount && exchangeCurrencyText !== currencyText &&
               <Text style={ [styles.text, amountTextStyle, styles.smallText, exchangedAmountTextStyle] }>
                   {
                       Array.isArray(exchangedAmount)
                       ? exchangedAmount
                       .map(
                           (amount, i) =>
                               `${ amount } ${ Array.isArray(exchangeCurrencyText)
                                               ? exchangeCurrencyText?.[i] ?? "?"
                                               : exchangeCurrencyText }`
                       )
                       .join(" + ")
                       : `${ exchangedAmount } ${ exchangeCurrencyText ?? "" }`
                   }
               </Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: SEPARATOR_SIZES.lightSmall / 4
    },
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        letterSpacing: FONT_SIZES.p4 * 0.025,
        color: COLORS.gray1,
        textAlign: "right"
    },
    smallText: {
        fontSize: FONT_SIZES.p4 * 0.9,
        letterSpacing: FONT_SIZES.p4 * 0.9 * 0.025,
        color: COLORS.gray2
    }
});