import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Button from "../Button/Button.ts";
import { Amount } from "../../features/_shared/currency/schemas/amountSchema.ts";
import { useBottomSheetInternal, useBottomSheetScrollableCreator } from "@gorhom/bottom-sheet";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { AmountText } from "../AmountText.tsx";
import { ExpandableListItem, ExpandableListItemType } from "./ExpandableListItem.tsx";
import { DropdownView } from "../dropdownView/DropdownView.tsx";
import InputTitle from "../Input/common/InputTitle.tsx";
import { useTranslation } from "react-i18next";

type ExpandableListProps = {
    expanded: boolean
    data: Array<ExpandableListItemType>
    title?: string
    subtitle?: string
    totalAmount?: Array<Omit<Amount, "exchangeRate">>
    actionIcon?: string
    onAction?: () => void
    onItemPress?: (index: number) => void
    onRemoveItem?: (index: number) => void
}

export function ExpandableList({
    expanded,
    data,
    title,
    subtitle,
    totalAmount,
    actionIcon,
    onAction,
    onItemPress,
    onRemoveItem
}: ExpandableListProps) {
    const { t } = useTranslation();
    const keyExtractor = useCallback((item: ExpandableListItemType) => item.id.toString(), []);

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<ExpandableListItemType>) => (
            <ExpandableListItem
                { ...item }
                onPress={ onItemPress ? () => onItemPress(index) : undefined }
                onRemove={ onRemoveItem ? () => onRemoveItem(index) : undefined }
            />
        ),
        [onItemPress, onRemoveItem]
    );

    const renderSeparatorComponent = useCallback(() => <View style={ { height: SEPARATOR_SIZES.lightSmall } }/>, []);

    const renderEmptyComponent = useCallback(() => <Text style={ styles.label }>-</Text>, []);

    const bottomSheetInternal = useBottomSheetInternal(true);
    const BottomSheetFlashListScrollable = bottomSheetInternal ? useBottomSheetScrollableCreator() : undefined;

    return (
        <DropdownView expanded={ expanded }>
            <View style={ styles.topContainer }>
                <View style={ { flexDirection: "row" } }>
                    {
                        title &&
                       <InputTitle title={ title }/>
                    }
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
                </View>
                {
                    subtitle &&
                   <View style={ styles.topLabelContainer }>
                      <Text style={ styles.label }>{ subtitle }</Text>
                   </View>
                }
            </View>
            <FlashList<ExpandableListItemType>
                data={ data }
                keyExtractor={ keyExtractor }
                renderItem={ renderItem }
                ItemSeparatorComponent={ renderSeparatorComponent }
                ListEmptyComponent={ renderEmptyComponent }
                showsVerticalScrollIndicator={ false }
                style={ styles.itemsContainer }
                renderScrollComponent={ BottomSheetFlashListScrollable }
            />
            {
                totalAmount &&
               <View style={ styles.bottomContainer }>
                  <AmountText
                     amount={ totalAmount.reduce((sum, a) => sum + a.exchangedAmount, 0) }
                     currencyText={ totalAmount[0]?.exchangeCurrency?.symbol ?? "?" }
                     exchangedAmount={ totalAmount.length !== 1 ? totalAmount.map(a => Number(a.amount ?? 0)) : null }
                     exchangeCurrencyText={ totalAmount.map(a => a.currency.symbol ?? "?") }
                     freeText={ "-" }
                  />
                  <Text style={ [styles.label, styles.bottomContainerLabel] }>{ t("currency.total_cost") }</Text>
               </View>
            }
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
        textAlign: "right"
    },
    countText: {
        color: COLORS.gray2
    },
    totalAmountText: {
        fontSize: FONT_SIZES.p4 * 0.85
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
        marginBottom: SEPARATOR_SIZES.lightSmall / 2
    },
    topLabelContainer: {
        flex: 1,
        alignSelf: "flex-end"
    },
    bottomContainer: {
        flex: 1,
        alignItems: "flex-end",
        borderTopWidth: 1,
        borderColor: COLORS.gray3,
        paddingTop: SEPARATOR_SIZES.lightSmall,
        marginTop: SEPARATOR_SIZES.lightSmall / 2
    },
    bottomContainerLabel: {
        paddingTop: SEPARATOR_SIZES.lightSmall / 4
    }
});