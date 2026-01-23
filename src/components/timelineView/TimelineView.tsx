import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { TimelineItem, TimelineItemType } from "./item/TimelineItem.tsx";
import { FlashList, FlashListRef, ListRenderItemInfo } from "@shopify/flash-list";
import { MoreDataLoading } from "../loading/MoreDataLoading.tsx";
import { RNNativeScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { FilterButton, FilterButtonProps } from "../filter/FilterButton.tsx";
import { FilterRow } from "../filter/FilterRow.tsx";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "../../types";
import { useDelayedBoolean } from "../../hooks/useDelayedBoolean.ts";

type TimelineViewProps = {
    data: Array<TimelineItemType>
    orderButtons?: Array<FilterButtonProps>
    filterButtons?: Array<FilterButtonProps>
    isLoading?: boolean
    fetchNext?: () => Promise<void>
    fetchPrev?: () => Promise<void>
    isNextFetching?: boolean
    isPrevFetching?: boolean
    hasNext?: boolean
    hasPrev?: boolean
    scrollHandler?: (event: RNNativeScrollEvent, context?: Record<string, unknown>) => void
    style?: ViewStyle
    filtersContainerStyle?: ViewStyle
}

const DOT_ICON_SIZE = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE;

function ITimelineView({
    data,
    orderButtons,
    filterButtons,
    isLoading,
    fetchNext,
    fetchPrev,
    isNextFetching,
    isPrevFetching,
    hasNext,
    hasPrev,
    scrollHandler,
    style,
    filtersContainerStyle
}: TimelineViewProps) {
    const { t } = useTranslation();
    const showPrevLoading = useDelayedBoolean(!!isPrevFetching && !isLoading, 100);
    const showNextLoading = useDelayedBoolean(!!isNextFetching && !isLoading, 100);

    const ref = useRef<FlashListRef<TimelineItemType>>(null);

    const [filterRowsHeight, setFilterRowsHeight] = useState(0);

    useEffect(() => {
        if(!isLoading) ref.current?.scrollToTop();
    }, [isLoading]);

    const renderItem = useCallback(({ item, index }: ListRenderItemInfo<TimelineItemType>) => (
        <TimelineItem
            { ...item }
            iconSize={ DOT_ICON_SIZE }
            isFirst={ index === 0 }
            isLast={ index + 1 === data.length }
        />
    ), [data]);

    const renderListEmptyComponent = useCallback(() => {
        if(isLoading) return <MoreDataLoading text={ t("log.loading") }/>;

        return (
            <TimelineItem
                id="not-found"
                milestone={ t("log.item_not_found") }
                title={ t("log.item_not_found_description") }
                color={ COLORS.gray2 }
                isFirst
                isLast
            />
        );
    }, [isLoading, t]);

    const renderHeader = useCallback(() => {
        if(!showPrevLoading) return null;

        return <MoreDataLoading text={ t("log.previous_data_loading") }/>;
    }, [showPrevLoading, t]);

    const renderFooter = useCallback(() => {
        if(!showNextLoading) return null;

        return <MoreDataLoading text={ t("log.next_data_loading") }/>;
    }, [showNextLoading, t]);

    const keyExtractor = useCallback((item: TimelineItemType) => item.id, []);

    const filterRowsOnLayout = useCallback((event: LayoutChangeEvent) => {
        setFilterRowsHeight(event.nativeEvent.layout.height);
    }, []);

    return (
        <View style={ styles.container }>
            <View
                style={ [styles.filtersContainer, filtersContainerStyle] }
                onLayout={ filterRowsOnLayout }
            >
                {
                    orderButtons &&
                   <FilterRow style={ { paddingHorizontal: DEFAULT_SEPARATOR } }>
                       { orderButtons.map((props, index) => <FilterButton key={ index.toString() } { ...props } />) }
                   </FilterRow>
                }
                {
                    filterButtons &&
                   <FilterRow style={ { paddingHorizontal: DEFAULT_SEPARATOR } }>
                       { filterButtons.map((props, index) => <FilterButton key={ index.toString() } { ...props } />) }
                   </FilterRow>
                }
            </View>
            <FlashList<TimelineItemType>
                ref={ ref }
                data={ data }
                renderItem={ renderItem }
                drawDistance={ heightPercentageToDP(100) }
                keyExtractor={ keyExtractor }
                ListEmptyComponent={ renderListEmptyComponent }
                ListHeaderComponent={ renderHeader }
                ListFooterComponent={ renderFooter }
                onEndReached={ !isLoading && hasPrev ? fetchNext : undefined }
                onEndReachedThreshold={ 0.5 }
                onStartReached={ !isLoading && hasNext ? fetchPrev : undefined }
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
        backgroundColor: COLORS.black2,
        left: -DEFAULT_SEPARATOR,
        right: -DEFAULT_SEPARATOR,
        zIndex: 1
    }
});

export const TimelineView = React.memo(ITimelineView);