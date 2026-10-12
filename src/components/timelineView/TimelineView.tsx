import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { TimelineItem, TimelineItemType } from "./item/TimelineItem.tsx";
import { FlashList, FlashListRef, ListRenderItemInfo } from "@shopify/flash-list";
import { MoreDataLoading } from "../loading/MoreDataLoading.tsx";
import { RNNativeScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";
import { LayoutChangeEvent, Platform, ScrollView, ScrollViewProps, StyleSheet, View } from "react-native";
import { FilterButton, FilterButtonProps } from "../filter/FilterButton.tsx";
import { FilterRow } from "../filter/FilterRow.tsx";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "../../types";
import { useDelayedBoolean } from "../../hooks/useDelayedBoolean.ts";
import { DateRangePicker } from "../Input/datePicker/presets/DateRangePicker.tsx";
import { WEB_SCROLLBAR_STYLE } from "../screenView/webScrollbarStyle";
import { useDesktopWeb } from "../../hooks/useDesktopWeb";

export type FilterByRange = (from: string | null, to: string | null) => void

type TimelineViewProps = {
    data: Array<TimelineItemType>
    filterByRange?: FilterByRange
    orderButtons?: Array<FilterButtonProps>
    filterButtons?: Array<FilterButtonProps>
    isLoading?: boolean
    fetchNext?: () => Promise<void>
    fetchPrev?: () => Promise<void>
    isNextFetching?: boolean
    isPrevFetching?: boolean
    scrollHandler?: (event: RNNativeScrollEvent, context?: Record<string, unknown>) => void
    style?: ViewStyle
    filtersContainerStyle?: ViewStyle
}

const DOT_ICON_SIZE = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE;

// FlashList invokes renderScrollComponent as a render function and forwards the
// scroll ref in props, so this must remain a regular function component.
const WebTimelineScrollView = (props: ScrollViewProps) => (
    <ScrollView
        { ...props }
        nativeID="carlog-timeline-scrollbar"
        style={ [
            props.style,
            WEB_SCROLLBAR_STYLE,
            { flex: 1, minWidth: 0, minHeight: 0, overflowY: "auto", overflowX: "hidden" } as any
        ] }
    />
);

function ITimelineView({
    data,
    filterByRange,
    orderButtons,
    filterButtons,
    isLoading,
    fetchNext,
    fetchPrev,
    isNextFetching,
    isPrevFetching,
    scrollHandler,
    style,
    filtersContainerStyle
}: TimelineViewProps) {
    const showWebScrollbar = useDesktopWeb();
    const { t } = useTranslation();
    const showPrevLoading = useDelayedBoolean(!!isPrevFetching && !isLoading, 100);
    const showNextLoading = useDelayedBoolean(!!isNextFetching && !isLoading, 100);

    const ref = useRef<FlashListRef<TimelineItemType>>(null);

    const [filterRowsHeight, setFilterRowsHeight] = useState(0);
    const [from, setFrom] = useState<string | null>(null);
    const [to, setTo] = useState<string | null>(null);

    useEffect(() => {
        if(Platform.OS !== "web" || typeof document === "undefined") return;

        const styleElement = document.createElement("style");
        styleElement.dataset.carlogTimelineScrollbar = "true";
        styleElement.textContent = `
            #carlog-timeline-scrollbar {
                scrollbar-width: thin !important;
                scrollbar-color: ${ COLORS.fuelYellow } ${ COLORS.gray5 } !important;
                overflow-y: auto !important;
            }
            #carlog-timeline-scrollbar::-webkit-scrollbar {
                width: 9px;
                height: 9px;
            }
            #carlog-timeline-scrollbar::-webkit-scrollbar-track {
                background: ${ COLORS.gray5 };
            }
            #carlog-timeline-scrollbar::-webkit-scrollbar-thumb {
                background: ${ COLORS.fuelYellow };
                border-radius: 8px;
                border: 2px solid ${ COLORS.gray5 };
            }
        `;
        document.head.appendChild(styleElement);
        return () => styleElement.remove();
    }, []);

    useEffect(() => {
        if(!isLoading) ref.current?.scrollToTop();
    }, [isLoading]);

    useEffect(() => {
        if(filterByRange) filterByRange(from, to);
    }, [filterByRange, from, to]);

    const renderItem = useCallback(({ item, index }: ListRenderItemInfo<TimelineItemType>) => (
        <View style={ [styles.timelineItemContainer, showWebScrollbar && styles.desktopTimelineItemContainer] }>
            <TimelineItem
                { ...item }
                iconSize={ DOT_ICON_SIZE }
                isFirst={ index === 0 }
                isLast={ index + 1 === data.length }
            />
        </View>
    ), [data, showWebScrollbar]);

    const renderListEmptyComponent = useCallback(() => {
        if(isLoading) return <MoreDataLoading text={ t("log.loading") }/>;

        return (
            <View style={ [styles.timelineItemContainer, showWebScrollbar && styles.desktopTimelineItemContainer] }>
                <TimelineItem
                    id="not-found"
                    milestone={ t("log.item_not_found") }
                    title={ t("log.item_not_found_description") }
                    color={ COLORS.gray2 }
                    isFirst
                    isLast
                />
            </View>
        );
    }, [isLoading, showWebScrollbar, t]);

    const renderHeader = useCallback(() => {
        if(!showPrevLoading) return null;

        return <View style={ [
            styles.timelineItemContainer,
            showWebScrollbar && styles.desktopTimelineItemContainer
        ] }><MoreDataLoading text={ t("log.previous_data_loading") }/></View>;
    }, [showPrevLoading, showWebScrollbar, t]);

    const renderFooter = useCallback(() => {
        if(!showNextLoading) return null;

        return <View style={ [
            styles.timelineItemContainer,
            showWebScrollbar && styles.desktopTimelineItemContainer
        ] }><MoreDataLoading text={ t("log.next_data_loading") }/></View>;
    }, [showNextLoading, showWebScrollbar, t]);

    const keyExtractor = useCallback((item: TimelineItemType) => item.id, []);

    const filterRowsOnLayout = useCallback((event: LayoutChangeEvent) => {
        setFilterRowsHeight(event.nativeEvent.layout.height);
    }, []);

    return (
        <View style={ styles.container }>
            <View
                style={ [
                    styles.filtersContainer,
                    showWebScrollbar && styles.desktopFiltersContainer,
                    filtersContainerStyle
                ] }
                onLayout={ filterRowsOnLayout }
            >
                {
                    filterByRange &&
                   <DateRangePicker
                      from={ from }
                      to={ to }
                      setFrom={ setFrom }
                      setTo={ setTo }
                      style={ styles.datePickerContainer }
                   />
                }
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
                style={ showWebScrollbar ? styles.desktopList : undefined }
                renderScrollComponent={ showWebScrollbar ? WebTimelineScrollView : undefined }
                data={ data }
                renderItem={ renderItem }
                drawDistance={ heightPercentageToDP(100) }
                keyExtractor={ keyExtractor }
                ListEmptyComponent={ renderListEmptyComponent }
                ListHeaderComponent={ renderHeader }
                ListFooterComponent={ renderFooter }
                onEndReached={ !isLoading ? fetchNext : undefined }
                onEndReachedThreshold={ 0.5 }
                onStartReached={ !isLoading ? fetchPrev : undefined }
                onStartReachedThreshold={ 0.5 }
                keyboardDismissMode="on-drag"
                contentContainerStyle={ [
                    style,
                    { flexGrow: 1, paddingTop: filterRowsHeight + SEPARATOR_SIZES.lightSmall }
                ] }
                showsVerticalScrollIndicator={ showWebScrollbar }
                showsHorizontalScrollIndicator={ false }
                onScroll={ scrollHandler }
                scrollEventThrottle={ 64 }
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
    },
    desktopFiltersContainer: {
        left: 0,
        right: 0,
        width: "100%",
        alignSelf: "stretch"
    },
    desktopList: {
        flex: 1,
        minWidth: 0,
        minHeight: 0
    },
    timelineItemContainer: {
        width: "100%"
    },
    desktopTimelineItemContainer: {
        maxWidth: 1480,
        alignSelf: "center"
    },
    datePickerContainer: {
        position: "relative",
        marginLeft: DEFAULT_SEPARATOR,
        marginRight: DEFAULT_SEPARATOR,
        marginBottom: SEPARATOR_SIZES.lightSmall
    }
});

export const TimelineView = React.memo(ITimelineView);
