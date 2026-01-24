import React, { useCallback, useEffect, useRef, useState } from "react";
import PickerItem, { PickerItemType } from "../PickerItem.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants";
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FlashList, FlashListRef, ListRenderItem } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import { MoreDataLoading } from "../../../loading/MoreDataLoading.tsx";

type DropdownPickerElementsProps = {
    items: Array<PickerItemType>
    initialStartIndex: number
    fetchNext?: (() => Promise<void>) | null
    fetchPrev?: (() => Promise<void>) | null
    isLoading: boolean
    isNextFetchingEnabled: boolean
    isPrevFetchingEnabled: boolean
    selectedItem: PickerItemType | null
    searchTerm: string
    onSelect: (item: PickerItemType) => void
    masonry?: boolean
    numColumns?: number
}

/**
 *  Renders the list of picker items within a dropdown picker.
 *
 * @component
 * @returns { ReactElement } A component that lists the dropdown picker items.
 */
function DropdownPickerItems({
    items,
    initialStartIndex,
    isLoading,
    fetchNext,
    fetchPrev,
    isNextFetchingEnabled,
    isPrevFetchingEnabled,
    selectedItem,
    searchTerm,
    onSelect,
    masonry,
    numColumns
}: DropdownPickerElementsProps) {
    const { t } = useTranslation();

    const flashListRef = useRef<FlashListRef<PickerItemType>>(null);
    const itemsFiltered = useRef(false); //this is for prevent scrolling to first element if data just fetched (not filtered)
    const [listReady, setListReady] = useState(false);

    useEffect(() => {
        itemsFiltered.current = true;
    }, [searchTerm]);

    useEffect(() => {
        if(!listReady || !itemsFiltered.current) return;

        flashListRef.current?.scrollToOffset({ offset: 0, animated: false });
        itemsFiltered.current = false;
    }, [listReady, items]);

    useEffect(() => {
        if(!listReady || !selectedItem) return;

        const index = items.findIndex(i => i.value === selectedItem?.value);
        if(index === -1) return;

        flashListRef.current?.scrollToIndex({ index, animated: true });
    }, [listReady, selectedItem]);

    const onStartReached = useCallback(() => {
        if((flashListRef.current?.getAbsoluteLastScrollOffset() === 0 && selectedItem) || !isPrevFetchingEnabled) return;

        fetchPrev?.();
    }, [isPrevFetchingEnabled, selectedItem, fetchPrev]);

    const onEndReached = useCallback(() => {
        if(!isNextFetchingEnabled) return;

        fetchNext?.();
    }, [fetchNext, isNextFetchingEnabled]);


    const keyExtractor = useCallback(
        (
            item: PickerItemType,
            index: number
        ) => `${ item.title ?? item?.toString() ?? index.toString() }-${ item.value }`,
        []
    );

    const renderItem: ListRenderItem<PickerItemType> = useCallback(
        ({ item, index }) => {
            const gap = SEPARATOR_SIZES.lightSmall;
            const columns = numColumns ?? 1;
            const marginLeft = ((index % columns) / (columns - 1)) * gap;
            const marginRight = gap - marginLeft;

            return (
                <PickerItem
                    item={ item }
                    onPress={ () => onSelect(item) }
                    selected={ item.value === selectedItem?.value }
                    style={ [
                        { paddingVertical: SEPARATOR_SIZES.lightSmall },
                        masonry ? { marginLeft, marginRight } : {}
                    ] }
                />
            );
        },
        [masonry, onSelect, selectedItem, items]
    );

    const renderSeparatorComponent = useCallback(
        () => <View style={ { height: SEPARATOR_SIZES.small } }/>,
        []
    );

    const renderListEmptyComponent = useCallback(
        () => {
            if(isLoading) return <MoreDataLoading/>;

            return <Text style={ styles.notFoundText }>{ t("form.picker.no_item_found") }</Text>;
        },
        [t, isLoading]
    );

    return (
        <View style={ styles.container }>
            <FlashList
                ref={ flashListRef }
                data={ items }
                initialScrollIndex={ initialStartIndex }
                masonry={ masonry }
                numColumns={ numColumns }
                optimizeItemArrangement={ false }
                renderItem={ renderItem }
                drawDistance={ hp(100) }
                keyExtractor={ keyExtractor }
                ListEmptyComponent={ renderListEmptyComponent }
                ItemSeparatorComponent={ renderSeparatorComponent }
                nestedScrollEnabled
                scrollEventThrottle={ 16 }
                onStartReached={ onStartReached }
                onStartReachedThreshold={ 0.5 }
                onEndReached={ onEndReached }
                onEndReachedThreshold={ 0.5 }
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={ false }
                showsHorizontalScrollIndicator={ false }
                onLayout={ () => setListReady(true) }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: heightPercentageToDP(31)
    },
    notFoundText: {
        flexGrow: 1,
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        color: COLORS.gray1,
        lineHeight: FONT_SIZES.p2 * 1.2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        textAlign: "center",
        textAlignVertical: "center"
    },
    stickyItemContainer: {
        backgroundColor: COLORS.gray5,
        paddingBottom: SEPARATOR_SIZES.lightSmall / 2
    }
});

export default DropdownPickerItems;