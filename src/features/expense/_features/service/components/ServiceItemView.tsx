import { Pressable, StyleSheet, Text, View } from "react-native";
import { ServiceItem } from "../schemas/serviceItemSchema.ts";
import React from "react";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import Button from "../../../../../components/Button/Button.ts";

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
            <Text style={ styles.pricePerUnitText }>
                {
                    item.pricePerUnit.amount === 0
                    ? "ingyen"
                    : `${ item.pricePerUnit.amount } ${ item.pricePerUnit.currency.symbol }`
                }
                {
                    item.pricePerUnit.exchangeCurrency.id !== item.pricePerUnit.currency.id && item.pricePerUnit.amount !== 0 &&
                   <>
                       { "\n" }
                      <Text style={ styles.pricePerUnitText.exchangedText }>
                          { item.pricePerUnit.exchangedAmount } { item.pricePerUnit.exchangeCurrency.symbol }
                      </Text>
                   </>
                }
            </Text>
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
        color: COLORS.gray1
    },
    countText: {
        color: COLORS.gray2
    },
    pricePerUnitText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1,
        maxWidth: "30%",
        textAlign: "right",

        exchangedText: {
            color: COLORS.gray2,
            lineHeight: FONT_SIZES.p4 * 1.25
        }
    }
});