import { AmountText, AmountTextProps } from "../AmountText.tsx";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Button from "../Button/Button.ts";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/index.ts";

export type ExpandableListItemType = {
    id: string | number // for keyExtractor
    title: string
    count?: number
    amountProps?: AmountTextProps
}

export type ExpandableListItemProps = ExpandableListItemType & {
    onPress?: () => void
    onRemove?: () => void
}

export function ExpandableListItem({
    title,
    count,
    amountProps,
    onPress,
    onRemove
}: ExpandableListItemProps) {
    return (
        <Pressable onPress={ onPress } disabled={ !onPress } style={ styles.container }>
            <View style={ styles.labelContainer }>
                {
                    onRemove &&
                   <Button.Icon
                      icon={ ICON_NAMES.close }
                      iconSize={ FONT_SIZES.p3 }
                      iconColor={ COLORS.gray2 }
                      width={ FONT_SIZES.p3 }
                      height={ FONT_SIZES.p3 }
                      backgroundColor="transparent"
                      onPress={ onRemove }
                   />
                }
                <Text style={ styles.itemText }>
                    { title }
                    { count && <Text style={ styles.countText }> (x{ count })</Text> }
                </Text>
            </View>
            {
                amountProps &&
               <AmountText { ...amountProps } />
            }
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