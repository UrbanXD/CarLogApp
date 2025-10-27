import React, { useCallback, useEffect, useMemo, useRef } from "react";
import PickerItem, { PickerItemType } from "../PickerItem.tsx";
import { COLORS, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../../constants/index.ts";
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
    const STICKY_FIRST_ELEMENT = !masonry && selectedItem && items.length > 7;

    const flashListRef = useRef<FlashListRef<PickerItemType>>(null);
    const itemsFiltered = useRef(false); //this is for prevent scrolling to first element if data just fetched (not filtered)

    useEffect(() => {
        itemsFiltered.current = true;
    }, [searchTerm]);

    useEffect(() => {
        if(!itemsFiltered.current) return;

        itemsFiltered.current = false;
        flashListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, [items]);

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
            const gap = SEPARATOR_SIZES.lightSmall / 2;
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
        [STICKY_FIRST_ELEMENT, masonry, onSelect, selectedItem]
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
        <FlashList
            ref={ flashListRef }
            data={ filteredItems }
            masonry={ masonry }
            numColumns={ numColumns }
            stickyHeaderIndices={ STICKY_FIRST_ELEMENT && [0] }
            renderItem={ renderItem }
            maintainVisibleContentPosition={ { disabled: true } }
            drawDistance={ hp(100) }
            keyExtractor={ keyExtractor }
            ListEmptyComponent={ renderListEmptyComponent }
            ItemSeparatorComponent={ renderSeparatorComponent }
            nestedScrollEnabled
            style={ { maxHeight: heightPercentageToDP(31) } }
            scrollEventThrottle={ 16 }
            onStartReached={ onStartReached }
            onStartReachedThreshold={ 0.5 }
            onEndReached={ onEndReached }
            onEndReachedThreshold={ 0.5 }
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={ false }
            showsHorizontalScrollIndicator={ false }
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.01,
        overflow: "hidden",
        backgroundColor: COLORS.gray5,
        marginHorizontal: SEPARATOR_SIZES.mediumSmall,
        paddingVertical: SEPARATOR_SIZES.small,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    notFoundText: {
        ...GLOBAL_STYLE.containerText,
        flexGrow: 1,
        textAlign: "center",
        textAlignVertical: "center",
        lineHeight: GLOBAL_STYLE.containerText.fontSize
    },
    stickyItemContainer: {
        backgroundColor: COLORS.gray5,
        paddingBottom: SEPARATOR_SIZES.lightSmall / 2
    }
});

export default DropdownPickerItems;