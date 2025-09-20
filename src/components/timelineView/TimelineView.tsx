import Divider from "../Divider.tsx";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { TimelineItem, TimelineItemType } from "./item/TimelineItem.tsx";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

type TimelineViewProps = {
    title: string
    subtitle?: string
    data: Array<TimelineItemType>
    fetchMore?: () => Promise<void>
}

const DOT_ICON_SIZE = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE;

export function TimelineView({ title, subtitle, data, fetchMore }: TimelineViewProps) {
    const renderItem = useCallback(({ item, index }: ListRenderItem<TimelineItemType>) => (
        <TimelineItem
            key={ index }
            { ...item }
            iconSize={ DOT_ICON_SIZE }
            isFirst={ index === 0 }
            isLast={ index + 1 === data.length }
        />
    ), []);

    const renderListEmptyComponent = useCallback(
        () => (
            <TimelineItem
                milestone="Nem található adat"
                title="Rögzítse első adatát itt..."
                color={ COLORS.gray2 }
                isFirst
                isLast
            />
        ), []
    );

    const keyExtractor = useCallback((_item: TimelineItemType, index: number) => index.toString(), []);

    return (
        <View style={ styles.container }>
            <View style={ styles.titleContainer }>
                <Text style={ styles.title }>{ title }</Text>
                {
                    subtitle &&
                   <Text style={ styles.subtitle }>{ subtitle }</Text>
                }
                <Divider
                    thickness={ 6 }
                    size={ widthPercentageToDP(35) }
                    color={ COLORS.fuelYellow }
                    style={ styles.divider }
                />
            </View>
            <FlashList
                // ref={ flashListRef }
                data={ data }
                renderItem={ renderItem }
                maintainVisibleContentPosition={ { disabled: true } }
                drawDistance={ heightPercentageToDP(100) }
                keyExtractor={ keyExtractor }
                ListEmptyComponent={ renderListEmptyComponent }
                scrollEventThrottle={ 16 }
                onEndReached={ fetchMore }
                onEndReachedThreshold={ 0.5 }
                fadingEdgeLength={ 1 }
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={ false }
                showsHorizontalScrollIndicator={ false }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.medium
    },
    titleContainer: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h2,
        lineHeight: FONT_SIZES.h2,
        color: COLORS.white
    },
    subtitle: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.h3,
        lineHeight: FONT_SIZES.h3,
        color: COLORS.white,
        textAlign: "left"
    },
    divider: {
        alignSelf: "flex-start",
        marginLeft: SEPARATOR_SIZES.mediumSmall
    }
});