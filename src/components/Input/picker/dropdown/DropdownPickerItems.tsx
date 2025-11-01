import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PickerItem, { PickerItemType } from "../PickerItem.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FlashList, FlashListRef } from "@shopify/flash-list";

type DropdownPickerElementsProps = {
    items: Array<PickerItemType>
    fetchByScrolling: ((direction?: ("next" | "prev")) => void) | null
    fetchingEnabled: boolean
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
    fetchByScrolling,
    fetchingEnabled,
    selectedItem,
    searchTerm,
    onSelect,
    masonry,
    numColumns
}: DropdownPickerElementsProps) {
    const STICKY_FIRST_ELEMENT = !masonry && selectedItem && items.length > 15;

    const flashListRef = useRef<FlashListRef<PickerItemType>>(null);
    const itemsFiltered = useRef(false); //this is for prevent scrolling to first element if data just fetched (not filtered)
    const [listReady, setListReady] = useState(false);

    useEffect(() => {
        itemsFiltered.current = true;
    }, [searchTerm]);

    useEffect(() => {
        if(!listReady) return;
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
        if(!fetchingEnabled) return;

        fetchByScrolling("prev");
    }, [fetchingEnabled, fetchByScrolling]);

    const onEndReached = useCallback(() => {
        if(!fetchingEnabled) return;

        fetchByScrolling("next");
    }, [fetchingEnabled, fetchByScrolling]);


    const keyExtractor = useCallback(
        (
            item: PickerItemType,
            index: number
        ) => `${ item.title ?? item?.toString() ?? index.toString() }-${ item.value }`,
        []
    );

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<PickerItemType>) => {
            const gap = SEPARATOR_SIZES.lightSmall;
            const marginLeft = ((index % numColumns) / (numColumns - 1)) * gap;
            const marginRight = gap - marginLeft;

            return (
                <View
                    style={ (STICKY_FIRST_ELEMENT && item.value === selectedItem?.value) && styles.stickyItemContainer }
                >
                    <PickerItem
                        item={ item }
                        onPress={ () => onSelect(item) }
                        selected={ item.value === selectedItem?.value }
                        style={ [
                            { paddingVertical: SEPARATOR_SIZES.lightSmall },
                            masonry && { marginLeft, marginRight }
                        ] }
                    />
                </View>
            );
        },
        [STICKY_FIRST_ELEMENT, masonry, onSelect, selectedItem, items]
    );

    const renderSeparatorComponent = useCallback(
        () => <View style={ { height: SEPARATOR_SIZES.small } }/>,
        []
    );

    const renderListEmptyComponent = useCallback(
        () => <Text style={ styles.notFoundText }>Nem található elem...</Text>,
        [selectedItem]
    );

    const filteredItems = useMemo(
        () => {
            if(!STICKY_FIRST_ELEMENT) return items;

            const filtered = items.filter(item => item.value !== selectedItem?.value);
            filtered.unshift(selectedItem);

            return filtered;
        },
        [STICKY_FIRST_ELEMENT, items, selectedItem]
    );

    return (
        <View style={ styles.container }>
            <FlashList
                ref={ flashListRef }
                data={ filteredItems }
                masonry={ masonry }
                numColumns={ numColumns }
                optimizeItemArrangement={ false }
                stickyHeaderIndices={ STICKY_FIRST_ELEMENT && [0] }
                renderItem={ renderItem }
                // maintainVisibleContentPosition={ { disabled: true } }
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