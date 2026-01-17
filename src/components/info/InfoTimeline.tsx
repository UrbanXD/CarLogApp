import { FlashList, FlashListRef, ListRenderItemInfo } from "@shopify/flash-list";
import { RNNativeScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";
import { StyleSheet, Text, View } from "react-native";
import React, { Ref, useCallback } from "react";
import { MoreDataLoading } from "../loading/MoreDataLoading.tsx";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Divider from "../Divider.tsx";
import Icon from "../Icon.tsx";
import FloatingActionMenu from "../../ui/floatingActionMenu/components/FloatingActionMenu.tsx";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "../../types/index.ts";

export type InfoTimelineItem = {
    id: string | number
    text: string
    callback?: () => void
}

type InfoTimelineProps = {
    ref: Ref<FlashListRef<any>>
    data: Array<InfoTimelineItem>
    openCreateForm: () => void
    onEdit: (id: string | number, callback?: () => void) => void
    onDelete: (id: string | number, callback?: () => void) => void
    isInitialFetching?: boolean
    fetchNext?: () => Promise<void>
    fetchPrevious?: () => Promise<void>
    isNextFetching?: boolean
    isPreviousFetching?: boolean
    scrollHandler?: (event: RNNativeScrollEvent, context?: Record<string, unknown>) => void
    notFoundText?: string
    style?: ViewStyle
}

function IInfoTimeline({
    ref,
    data,
    openCreateForm,
    onEdit,
    onDelete,
    isInitialFetching,
    fetchNext,
    fetchPrevious,
    isNextFetching,
    isPreviousFetching,
    scrollHandler,
    notFoundText,
    style
}: InfoTimelineProps) {
    const { t } = useTranslation();

    const renderItem = useCallback(({ item }: ListRenderItemInfo<InfoTimelineItem>) => (
        <View style={ itemStyles.container }>
            <Text style={ itemStyles.text }>{ item.text }</Text>
            <View style={ itemStyles.iconContainer }>
                <Icon
                    icon={ ICON_NAMES.pencil }
                    color={ COLORS.gray1 }
                    size={ FONT_SIZES.p3 * ICON_FONT_SIZE_SCALE }
                    onPress={ () => onEdit(item?.id, item.callback) }
                />
                <Icon
                    icon={ ICON_NAMES.trashCan }
                    color={ COLORS.redLight }
                    size={ FONT_SIZES.p3 * ICON_FONT_SIZE_SCALE }
                    onPress={ () => onDelete(item?.id, item.callback) }
                />
            </View>
        </View>
    ), [onEdit, onDelete]);

    const renderListEmptyComponent = useCallback(() => {
        if(isInitialFetching) return <MoreDataLoading/>;

        return <Text style={ styles.notFoundText }>{ notFoundText ?? t("common.no_data_found") }</Text>;
    }, [isInitialFetching, t]);

    const renderHeader = useCallback(() => {
        if(!isPreviousFetching) return <></>;

        return <MoreDataLoading/>;
    }, [isPreviousFetching]);

    const renderFooter = useCallback(() => {
        if(!isNextFetching) return <></>;

        return <MoreDataLoading/>;
    }, [isNextFetching]);

    const renderSeparatorComponent = useCallback(() => {
        return (
            <Divider
                color={ COLORS.gray1 }
                size={ "100%" }
                margin={ SEPARATOR_SIZES.lightSmall }
            />
        );
    }, []);

    const keyExtractor = useCallback((item: InfoTimelineItem) => item.id.toString(), []);

    return (
        <>
            <FlashList<InfoTimelineItem>
                ref={ ref }
                data={ data }
                renderItem={ renderItem }
                drawDistance={ heightPercentageToDP(100) }
                keyExtractor={ keyExtractor }
                ListEmptyComponent={ renderListEmptyComponent }
                ListHeaderComponent={ renderHeader }
                ListFooterComponent={ renderFooter }
                ItemSeparatorComponent={ renderSeparatorComponent }
                onEndReached={ fetchNext }
                onEndReachedThreshold={ 0.5 }
                onStartReached={ fetchPrevious }
                onStartReachedThreshold={ 0.5 }
                keyboardDismissMode="on-drag"
                contentContainerStyle={ [style, styles.listContainer] }
                showsVerticalScrollIndicator={ false }
                showsHorizontalScrollIndicator={ false }
                onScroll={ scrollHandler }
                scrollEventThrottle={ 16 }
            />
            <FloatingActionMenu action={ openCreateForm }/>
        </>
    );
}

const itemStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall / 2,
        paddingVertical: SEPARATOR_SIZES.lightSmall / 2
    },
    text: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.035,
        color: COLORS.white
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    }
});

const styles = StyleSheet.create({
    listContainer: {
        flexGrow: 1
    },
    notFoundText: {
        backgroundColor: COLORS.black5,
        borderRadius: 12.5,
        padding: SEPARATOR_SIZES.small,
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        letterSpacing: FONT_SIZES.p3 * 0.035,
        textAlign: "center",
        color: COLORS.gray2
    }
});

export const InfoTimeline = React.memo(IInfoTimeline);