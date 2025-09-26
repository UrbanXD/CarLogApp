import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE } from "../../constants/index.ts";
import React, { ReactNode, useCallback } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { TimelineItem, TimelineItemType } from "./item/TimelineItem.tsx";
import { ListRenderItem } from "@shopify/flash-list";
import { MoreDataLoading } from "../loading/MoreDataLoading.tsx";
import { AnimatedFlashList } from "../AnimatedComponents/index.ts";
import { RNNativeScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";
import { ViewStyle } from "react-native";

type TimelineViewProps = {
    data: Array<TimelineItemType>
    isInitialFetching?: boolean
    fetchNext?: () => Promise<void>
    fetchPrevious?: () => Promise<void>
    isNextFetching?: boolean
    isPreviousFetching?: boolean
    renderMilestone?: (milestone: string) => ReactNode
    scrollHandler?: (event: RNNativeScrollEvent, context?: Record<string, unknown>) => void
    style?: ViewStyle
}

const DOT_ICON_SIZE = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE;

function ITimelineView({
    data,
    isInitialFetching,
    fetchNext,
    fetchPrevious,
    isNextFetching,
    isPreviousFetching,
    renderMilestone,
    scrollHandler,
    style
}: TimelineViewProps) {
    const renderItem = useCallback(({ item, index }: ListRenderItem<TimelineItemType>) => (
        <TimelineItem
            renderMilestone={ renderMilestone }
            { ...item }
            iconSize={ DOT_ICON_SIZE }
            isFirst={ index === 0 }
            isLast={ index + 1 === data.length }
        />
    ), [renderMilestone, data]);

    const renderListEmptyComponent = useCallback(() => {
        if(isInitialFetching) return <MoreDataLoading text={ "Napló adatok olvasása" }/>;

        return (
            <TimelineItem
                id="not-found"
                milestone="Nem található adat"
                title="Rögzítse első adatát itt..."
                color={ COLORS.gray2 }
                isFirst
                isLast
            />
        );
    }, [isInitialFetching]);

    const renderHeader = useCallback(() => {
        if(!isPreviousFetching) return <></>;

        return <MoreDataLoading text={ "Korábbi napló adatok olvasása" }/>;
    }, [isPreviousFetching]);

    const renderFooter = useCallback(() => {
        if(!isNextFetching) return <></>;

        return <MoreDataLoading text={ "Régebbi napló adatok olvasása" }/>;
    }, [isNextFetching]);

    const keyExtractor = useCallback((item: TimelineItemType) => item.id, []);

    return (
        <AnimatedFlashList
            data={ data }
            renderItem={ renderItem }
            maintainVisibleContentPosition={ { disabled: true } }
            drawDistance={ heightPercentageToDP(100) }
            keyExtractor={ keyExtractor }
            ListEmptyComponent={ renderListEmptyComponent }
            ListHeaderComponent={ renderHeader }
            ListFooterComponent={ renderFooter }
            onEndReached={ fetchPrevious }
            onEndReachedThreshold={ 0.5 }
            onStartReached={ fetchNext }
            onStartReachedThreshold={ 0.5 }
            keyboardDismissMode="on-drag"
            contentContainerStyle={ [style, { flexGrow: 1 }] }
            showsVerticalScrollIndicator={ false }
            showsHorizontalScrollIndicator={ false }
            onScroll={ scrollHandler }
            scrollEventThrottle={ 16 }
        />
    );
}

export const TimelineView = React.memo(ITimelineView);