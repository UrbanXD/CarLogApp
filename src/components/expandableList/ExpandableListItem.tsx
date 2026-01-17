import { AmountText, AmountTextProps } from "../AmountText.tsx";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/index.ts";
import Icon from "../Icon.tsx";

export type ExpandableListItemType = {
    id: string | number // for keyExtractor
    title: string
    subtitle?: string
    count?: number
    amountProps?: AmountTextProps
}

export type ExpandableListItemProps = ExpandableListItemType & {
    onPress?: () => void
    onRemove?: () => void
}

export function ExpandableListItem({
    title,
    subtitle,
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
                   <Icon
                      icon={ ICON_NAMES.close }
                      size={ FONT_SIZES.p3 * 0.9 }
                      color={ COLORS.gray2 }
                      onPress={ onRemove }
                   />
                }
                <View>
                    <Text style={ styles.itemText }>
                        { title }
                    </Text>
                    {
                        subtitle &&
                       <Text style={ [styles.itemText, styles.countText] }>{ subtitle }</Text>
                    }
                </View>
                { count && <Text style={ [styles.itemText, styles.countText] }> (x{ count })</Text> }
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
        gap: SEPARATOR_SIZES.lightSmall / 2
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