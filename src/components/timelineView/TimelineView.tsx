import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import React, { ReactNode, useCallback, useState } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { TimelineItem, TimelineItemType } from "./item/TimelineItem.tsx";
import { ListRenderItem } from "@shopify/flash-list";
import { MoreDataLoading } from "../loading/MoreDataLoading.tsx";
import { AnimatedFlashList } from "../AnimatedComponents/index.ts";
import { RNNativeScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";
import { FilterButton, FilterButtonProps } from "../filter/FilterButton.tsx";
import { FilterRow } from "../filter/FilterRow.tsx";

type TimelineViewProps = {
    data: Array<TimelineItemType>
    orderButtons?: Array<FilterButtonProps>
    filterButtons?: Array<FilterButtonProps>
    isInitialFetching?: boolean
    fetchNext?: () => Promise<void>
    fetchPrevious?: () => Promise<void>
    isNextFetching?: boolean
    isPreviousFetching?: boolean
    renderMilestone?: (milestone: string) => ReactNode
    scrollHandler?: (event: RNNativeScrollEvent, context?: Record<string, unknown>) => void
    style?: ViewStyle
    filtersContainerStyle?: ViewStyle
}

const DOT_ICON_SIZE = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE;

function ITimelineView({
    data,
    orderButtons,
    filterButtons,
    isInitialFetching,
    fetchNext,
    fetchPrevious,
    isNextFetching,
    isPreviousFetching,
    renderMilestone,
    scrollHandler,
    style,
    filtersContainerStyle
}: TimelineViewProps) {
    const [filterRowsHeight, setFilterRowsHeight] = useState(0);

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

    const filterRowsOnLayout = useCallback((event: LayoutChangeEvent) => {
        setFilterRowsHeight(event.nativeEvent.layout.height);
    });

    return (
        <View style={ styles.container }>
            <View
                style={ [styles.filtersContainer, filtersContainerStyle] }
                onLayout={ filterRowsOnLayout }
            >
                {
                    orderButtons &&
                   <FilterRow>
                       { orderButtons.map((props, index) => <FilterButton key={ index.toString() } { ...props } />) }
                   </FilterRow>
                }
                {
                    filterButtons &&
                   <FilterRow>
                       { filterButtons.map((props, index) => <FilterButton key={ index.toString() } { ...props } />) }
                   </FilterRow>
                }
            </View>
            <AnimatedFlashList
                data={ data }
                renderItem={ renderItem }
                drawDistance={ heightPercentageToDP(100) }
                keyExtractor={ keyExtractor }
                ListEmptyComponent={ renderListEmptyComponent }
                ListHeaderComponent={ renderHeader }
                ListFooterComponent={ renderFooter }
                onEndReached={ fetchNext }
                onEndReachedThreshold={ 0.5 }
                onStartReached={ fetchPrevious }
                onStartReachedThreshold={ 0.5 }
                keyboardDismissMode="on-drag"
                contentContainerStyle={ [
                    style,
                    { flexGrow: 1, paddingTop: filterRowsHeight + SEPARATOR_SIZES.lightSmall }
                ] }
                showsVerticalScrollIndicator={ false }
                showsHorizontalScrollIndicator={ false }
                onScroll={ scrollHandler }
                scrollEventThrottle={ 16 }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative"
    },
    filtersContainer: {
        position: "absolute",
        left: -DEFAULT_SEPARATOR,
        right: -DEFAULT_SEPARATOR,
        zIndex: 1
    }
});

export const TimelineView = React.memo(ITimelineView);