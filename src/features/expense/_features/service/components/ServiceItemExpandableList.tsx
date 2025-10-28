import { DropdownView } from "../../../../../components/dropdownView/DropdownView.tsx";
import { ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { ServiceItemView } from "./ServiceItemView.tsx";
import { FormResultServiceItem, ServiceItem } from "../schemas/serviceItemSchema.ts";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../../../../constants/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Button from "../../../../../components/Button/Button.ts";
import { Amount } from "../../../../_shared/currency/schemas/amountSchema.ts";
import { useBottomSheetInternal, useBottomSheetScrollableCreator } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";

type ServiceItemExpandableListProps = {
    expanded: boolean
    data: Array<FormResultServiceItem>
    totalAmount: Array<Amount>
    actionIcon?: string
    onAction?: () => void
    onItemPress?: (index: number) => void
    onDeleteItem?: (index: number) => void
}

export function ServiceItemExpandableList({
    expanded,
    data,
    totalAmount,
    actionIcon,
    onAction,
    onItemPress,
    onDeleteItem
}: ServiceItemExpandableListProps) {
    const keyExtractor = useCallback((item: ServiceItem) => item.id, []);

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<ServiceItem>) => (
            <ServiceItemView
                item={ item }
                onPress={ onItemPress ? () => onItemPress(index) : undefined }
                onDelete={ onDeleteItem ? () => onDeleteItem(index) : undefined }
            />
        ),
        [onItemPress, onDeleteItem]
    );

    const renderSeparatorComponent = useCallback(() => <View style={ { height: SEPARATOR_SIZES.lightSmall } }/>, []);

    const renderEmptyComponent = useCallback(() => <Text style={ styles.label }>-</Text>);

    const getTotalAmountText = useCallback(() => {
        if(!totalAmount?.length) return "ingyen";

        return totalAmount.map(a => `${ a.amount } ${ a.currency.symbol || a.currency.code }`).join(" + ");
    }, [totalAmount]);

    const getTotalExchangedAmountText = useCallback(() => {
        if(!totalAmount?.length) return "-";

        const totalExchanged = totalAmount.reduce((sum, a) => sum + a.exchangedAmount, 0);
        const exchangeCurrency = totalAmount[0].exchangeCurrency.symbol || totalAmount[0].exchangeCurrency.code;

        return `${ totalExchanged } ${ exchangeCurrency }`;
    });

    const bottomSheetInternal = useBottomSheetInternal(true);
    const BottomSheetFlashListScrollable = bottomSheetInternal ? useBottomSheetScrollableCreator() : undefined;

    return (
        <DropdownView expanded={ expanded }>
            <View style={ styles.topContainer }>
                {
                    onAction && actionIcon &&
                   <Button.Icon
                      icon={ actionIcon }
                      iconSize={ styles.text.fontSize * ICON_FONT_SIZE_SCALE }
                      iconColor={ styles.text.color }
                      width={ styles.text.fontSize * ICON_FONT_SIZE_SCALE }
                      height={ styles.text.fontSize * ICON_FONT_SIZE_SCALE }
                      backgroundColor="transparent"
                      onPress={ onAction }
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
                ListEmptyComponent={ renderEmptyComponent }
                showsVerticalScrollIndicator={ false }
                style={ styles.itemsContainer }
                renderScrollComponent={ BottomSheetFlashListScrollable }
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
        letterSpacing: FONT_SIZES.p3 * 0.025,
        color: COLORS.gray2,
        textAlign: "right"
    },
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        letterSpacing: FONT_SIZES.p3 * 0.025,
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