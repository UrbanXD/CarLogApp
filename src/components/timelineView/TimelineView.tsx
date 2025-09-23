import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE } from "../../constants/index.ts";
import React, { ReactNode, useCallback } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { TimelineItem, TimelineItemType } from "./item/TimelineItem.tsx";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

type TimelineViewProps = {
    data: Array<TimelineItemType>
    fetchMore?: () => Promise<void>
    renderMilestone?: (milestone: string) => ReactNode
}

const DOT_ICON_SIZE = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE;

export function TimelineView({ data, fetchMore, renderMilestone }: TimelineViewProps) {
    const renderItem = useCallback(({ item, index }: ListRenderItem<TimelineItemType>) => (
        <TimelineItem
            key={ index }
            renderMilestone={ renderMilestone }
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
        <FlashList
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
            contentContainerStyle={ { flexGrow: 1 } }
            showsVerticalScrollIndicator={ false }
            showsHorizontalScrollIndicator={ false }
        />
    );
}