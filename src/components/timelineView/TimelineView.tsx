import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE } from "../../constants/index.ts";
import React, { ReactNode, useCallback } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { TimelineItem, TimelineItemType } from "./item/TimelineItem.tsx";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { MoreDataLoading } from "../loading/MoreDataLoading.tsx";
import { ScrollEvent } from "react-native";

type TimelineViewProps = {
    data: Array<TimelineItemType>
    fetchMore?: () => Promise<void>
    isFetching?: boolean
    renderMilestone?: (milestone: string) => ReactNode
    onScrollBeginDrag?: (event: ScrollEvent) => void
    onScrollEndDrag?: (event: ScrollEvent) => void

}

const DOT_ICON_SIZE = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE;

function ITimelineView({
    data,
    fetchMore,
    isFetching,
    renderMilestone,
    onScrollBeginDrag,
    onScrollEndDrag
}: TimelineViewProps) {
    const renderItem = useCallback(({ item, index }: ListRenderItem<TimelineItemType>) => (
        <TimelineItem
            key={ index }
            renderMilestone={ renderMilestone }
            { ...item }
            iconSize={ DOT_ICON_SIZE }
            isFirst={ index === 0 }
            isLast={ index + 1 === data.length }
        />
    ), [renderMilestone, data]);

    const renderListEmptyComponent = useCallback(() => {
        if(isFetching) return null;

        return (
            <TimelineItem
                milestone="Nem található adat"
                title="Rögzítse első adatát itt..."
                color={ COLORS.gray2 }
                isFirst
                isLast
            />
        );
    }, [isFetching]);

    const renderFooter = useCallback(() => {
        if(!isFetching) return null;

        return <MoreDataLoading text={ "Régebbi napló adatok olvasása" }/>;
    }, [isFetching]);

    const keyExtractor = useCallback((_item: TimelineItemType, index: number) => index.toString(), []);

    return (
        <FlashList
            data={ data }
            renderItem={ renderItem }
            maintainVisibleContentPosition={ { disabled: true } }
            drawDistance={ heightPercentageToDP(100) }
            keyExtractor={ keyExtractor }
            ListEmptyComponent={ renderListEmptyComponent }
            ListFooterComponent={ renderFooter }
            scrollEventThrottle={ 16 }
            onEndReached={ fetchMore }
            onEndReachedThreshold={ 0.5 }
            keyboardDismissMode="on-drag"
            contentContainerStyle={ { flexGrow: 1 } }
            showsVerticalScrollIndicator={ false }
            showsHorizontalScrollIndicator={ false }
            onScrollBeginDrag={ onScrollBeginDrag }
            onScrollEndDrag={ onScrollEndDrag }
        />
    );
}

export const TimelineView = React.memo(ITimelineView);