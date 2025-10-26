import { DropdownView } from "../../../../../components/dropdownView/DropdownView.tsx";
import { FlashList } from "@shopify/flash-list";
import { ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { ServiceItemView } from "./ServiceItemView.tsx";
import { ServiceItem } from "../schemas/serviceItemSchema.ts";
import {
    COLORS,
    FONT_SIZES,
    ICON_FONT_SIZE_SCALE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../../../../constants/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Button from "../../../../../components/Button/Button.ts";
import { Amount } from "../../../../_shared/currency/schemas/amountSchema.ts";

type ServiceItemExpandableListProps = {
    expanded: boolean
    data: Array<ServiceItem>
    totalAmount: Array<Amount>
    onEdit?: () => void
}

export function ServiceItemExpandableList({ expanded, data, totalAmount, onEdit }: ServiceItemExpandableListProps) {
    const keyExtractor = useCallback((item: ServiceItem) => item.id, []);

    const renderItem = useCallback(({ item }: ListRenderItemInfo<ServiceItem>) => <ServiceItemView item={ item }/>, []);

    const renderSeparatorComponent = useCallback(() => <View style={ { height: SEPARATOR_SIZES.lightSmall } }/>, []);

    const getTotalAmountText = useCallback(() => {
        if(!totalAmount?.length) return "ingyen";

        return totalAmount.map(a => `${ a.amount } ${ a.currency.symbol || a.currency.code }`).join(" + ");
    }, [totalAmount]);

    const getTotalExchangedAmountText = useCallback(() => {
        if(!totalAmount?.length) return "";

        const totalExchanged = totalAmount.reduce((sum, a) => sum + a.exchangedAmount, 0);
        const exchangeCurrency = totalAmount[0].exchangeCurrency.symbol || totalAmount[0].exchangeCurrency.code;

        return `${ totalExchanged } ${ exchangeCurrency }`;
    });

    return (
        <DropdownView expanded={ expanded }>
            <View style={ styles.topContainer }>
                {
                    onEdit &&
                   <Button.Icon
                      icon={ ICON_NAMES.pencil }
                      iconSize={ styles.text.fontSize * ICON_FONT_SIZE_SCALE }
                      iconColor={ styles.text.color }
                      width={ styles.text.fontSize * ICON_FONT_SIZE_SCALE }
                      height={ styles.text.fontSize * ICON_FONT_SIZE_SCALE }
                      backgroundColor="transparent"
                      onPress={ onEdit }
                   />
                }
                <View style={ styles.topContainer.labelContainer }>
                    <Text style={ styles.label }>Egységár</Text>
                </View>
            </View>
            <FlashList
                data={ data }
                keyExtractor={ keyExtractor }
                renderItem={ renderItem }
                ItemSeparatorComponent={ renderSeparatorComponent }
                showsVerticalScrollIndicator={ false }
                style={ styles.itemsContainer }
            />
            <View style={ styles.bottomContainer }>
                <Text style={ styles.text }>
                    { getTotalExchangedAmountText() }
                </Text>
                {
                    ((totalAmount.length > 1) || (totalAmount.length === 1 && totalAmount[0].currency.id !== totalAmount[0].exchangeCurrency.id)) &&
                   <Text style={ [styles.text, styles.text.totalAmountText] }>
                       { getTotalAmountText() }
                   </Text>
                }
                <Text style={ [styles.label, styles.bottomContainer.label] }>Összköltéség</Text>
            </View>
        </DropdownView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row"
    },
    label: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray2,
        textAlign: "right"
    },
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray1,
        textAlign: "right",

        countText: {
            color: COLORS.gray2
        },

        totalAmountText: {
            fontSize: FONT_SIZES.p4 * 0.85
        }
    },
    itemsContainer: {
        maxHeight: heightPercentageToDP(30),
        flexGrow: 0
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: SEPARATOR_SIZES.lightSmall,
        borderBottomWidth: 1,
        borderColor: COLORS.gray3,
        paddingBottom: SEPARATOR_SIZES.lightSmall,
        marginBottom: SEPARATOR_SIZES.lightSmall / 2,

        labelContainer: {
            flex: 1,
            alignSelf: "flex-end"
        }
    },
    bottomContainer: {
        flex: 1,
        alignItems: "flex-end",
        borderTopWidth: 1,
        borderColor: COLORS.gray3,
        paddingTop: SEPARATOR_SIZES.lightSmall,
        marginTop: SEPARATOR_SIZES.lightSmall / 2,

        label: {
            paddingTop: SEPARATOR_SIZES.lightSmall / 4
        }
    }
});