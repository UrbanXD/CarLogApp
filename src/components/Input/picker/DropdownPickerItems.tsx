import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import PickerItem, { PickerItemType } from "./PickerItem.tsx";
import { COLORS, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import Animated, { useAnimatedRef, useSharedValue } from "react-native-reanimated";
import { ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useBottomSheetInternal, useBottomSheetScrollableCreator } from "@gorhom/bottom-sheet";
import DropdownView from "../../dropdownView/DropdownView.tsx";
import DropdownPickerSearchBar from "./DropdownPickerSearchBar.tsx";

type DropdownPickerElementsProps = {
    masonry?: boolean
    numColumns?: number
    searchBarPlaceholder?: string
}

/**
 *  Renders the list of picker items within a dropdown picker.
 *
 * @component
 * @returns { ReactElement } A component that lists the dropdown picker items.
 */
function DropdownPickerItems({ masonry, numColumns, searchBarPlaceholder }: DropdownPickerElementsProps) {
    const isBottomSheet = !!useBottomSheetInternal(true);
    const BottomSheetFlashListScrollable = isBottomSheet ? useBottomSheetScrollableCreator() : undefined;

    const {
        items,
        fetchByScrolling,
        fetchingEnabled,
        selectedItem,
        searchTerm,
        showItems,
        onSelect,
        toggleDropdown,
        searchBarEnable
    } = useDropdownPickerContext();

    const flashListRef = useRef<FlashListRef<PickerItemType>>(null);
    const listHeaderRef = useAnimatedRef<Animated.View>(null);
    const itemsFiltered = useRef(false); //this is for prevent scrolling to first element if data just fetched (not filtered)

    const [searchBarHeight, setSearchBarHeight] = useState(0);

    const scrollY = useSharedValue(0);

    useEffect(() => {
        itemsFiltered.current = true;
    }, [searchTerm]);

    useEffect(() => {
        if(!itemsFiltered.current) return;

        itemsFiltered.current = false;
        flashListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, [items]);

    useLayoutEffect(() => {
        if(!searchBarEnable) return;

        // its measure the header height at start only once
        listHeaderRef.current?.measure((_x, _y, _width, height, _pageX, _pageY) => {
            setSearchBarHeight(height);
        });
    }, []);

    const selectItem = useCallback((value: string) => {
        onSelect(value);
        toggleDropdown();
    }, [onSelect, toggleDropdown]);

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        "worklet";
        if(!searchBarEnable) return;

        scrollY.value = event.nativeEvent.contentOffset.y;
    }, [searchBarEnable]);

    const onStartReached = useCallback(() => {
        if(!fetchingEnabled) return;

        fetchByScrolling("prev");
    }, [fetchingEnabled, fetchByScrolling]);

    const onEndReached = useCallback(() => {
        if(!fetchingEnabled) return;

        fetchByScrolling("next");
    }, [fetchingEnabled, fetchByScrolling]);


    const keyExtractor = useCallback(
        (item: PickerItemType) => `${ item.title ?? "" }-${ item.value }`,
        []
    );

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<PickerItemType>) => {
            const gap = SEPARATOR_SIZES.lightSmall / 2;
            const marginLeft = ((index % numColumns) / (numColumns - 1)) * gap;
            const marginRight = gap - marginLeft;

            return (
                <PickerItem
                    item={ item }
                    onPress={ () => selectItem(item.value) }
                    selected={ item.value === selectedItem?.value }
                    style={ masonry && { marginLeft, marginRight } }
                />
            );
        },
        [selectItem, selectedItem]
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
        () => items.filter(item => item.value !== selectedItem?.value),
        [items, selectedItem]
    );

    return (
        <DropdownView height={ hp(29.5) } expanded={ showItems } paddingVertical={ SEPARATOR_SIZES.small }>
            {
                searchBarEnable &&
               <DropdownPickerSearchBar
                  ref={ listHeaderRef }
                  scrollY={ scrollY }
                  searchBarPlaceholder={ searchBarPlaceholder }
                  style={ {
                      paddingTop: SEPARATOR_SIZES.small,
                      backgroundColor: COLORS.gray5
                  } }
               />
            }
            <FlashList
                ref={ flashListRef }
                data={ filteredItems }
                masonry={ masonry }
                numColumns={ numColumns }
                renderItem={ renderItem }
                contentContainerStyle={ { paddingTop: searchBarEnable && searchBarHeight - SEPARATOR_SIZES.small } }
                maintainVisibleContentPosition={ { disabled: true } }
                drawDistance={ hp(100) }
                keyExtractor={ keyExtractor }
                ListEmptyComponent={ renderListEmptyComponent }
                ItemSeparatorComponent={ renderSeparatorComponent }
                nestedScrollEnabled
                onScroll={ searchBarEnable ? onScroll : undefined }
                scrollEventThrottle={ 16 }
                onStartReached={ onStartReached }
                onStartReachedThreshold={ 0.5 }
                onEndReached={ onEndReached }
                onEndReachedThreshold={ 0.5 }
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={ false }
                showsHorizontalScrollIndicator={ false }
                renderScrollComponent={ BottomSheetFlashListScrollable }
            />
        </DropdownView>
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
    }
});

export default DropdownPickerItems;