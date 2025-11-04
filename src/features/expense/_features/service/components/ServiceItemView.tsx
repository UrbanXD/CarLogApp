import { Pressable, StyleSheet, Text, View } from "react-native";
import { ServiceItem } from "../schemas/serviceItemSchema.ts";
import React from "react";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import Button from "../../../../../components/Button/Button.ts";
import { AmountText } from "../../../../../components/AmountText.tsx";

type ServiceItemProps = {
    item: ServiceItem
    onPress?: () => void
    onDelete?: () => void
}

export function ServiceItemView({ item, onPress, onDelete }: ServiceItemProps) {
    return (
        <Pressable onPress={ onPress } disabled={ !onPress } style={ styles.container }>
            <View style={ styles.labelContainer }>
                {
                    onDelete &&
                   <Button.Icon
                      icon={ ICON_NAMES.close }
                      iconSize={ FONT_SIZES.p3 }
                      iconColor={ COLORS.gray2 }
                      width={ FONT_SIZES.p3 }
                      height={ FONT_SIZES.p3 }
                      backgroundColor="transparent"
                      onPress={ onDelete }
                   />
                }
                <Text style={ styles.itemText }>
                    { item.type.key }
                    <Text style={ styles.countText }> (x{ item.quantity })</Text>
                </Text>
            </View>
            <AmountText
                amount={ item.pricePerUnit.amount }
                currencyText={ item.pricePerUnit.currency.symbol }
                exchangedAmount={ item.pricePerUnit.exchangedAmount }
                exchangeCurrencyText={ item.pricePerUnit.exchangeCurrency.symbol }
            />
        </Pressable>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall / 2,
        paddingVertical: SEPARATOR_SIZES.lightSmall / 2
    },
    labelContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    itemText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        letterSpacing: FONT_SIZES.p3 * 0.025,
        color: COLORS.gray1
    },
    countText: {
        fontSize: FONT_SIZES.p4,
        letterSpacing: FONT_SIZES.p4 * 0.05,
        color: COLORS.gray2
    }
});