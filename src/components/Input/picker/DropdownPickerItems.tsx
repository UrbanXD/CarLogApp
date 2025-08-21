import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import PickerItem, { PickerItemType } from "./PickerItem.tsx";
import { COLORS, GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { FlashList, FlashListProps, FlashListRef } from "@shopify/flash-list";
import Divider from "../../Divider.tsx";
import { BottomSheetFlashList, useBottomSheetInternal } from "@gorhom/bottom-sheet";
import SearchBar from "../../SearchBar.tsx";
import DropdownView from "../../dropdownView/DropdownView.tsx";

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
    const {
        items,
        fetchByScrolling,
        fetchingEnabled,
        selectedItem,
        searchTerm,
        showItems,
        onSelect,
        toggleDropdown,
        setSearchTerm,
        searchBarEnable
    } = useDropdownPickerContext();

    const flashListRef = useRef<FlashListRef<PickerItemType>>(null);
    const listHeaderRef = useRef<Animated.View | null>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const itemsFiltered = useRef(false);
    const lastScrollPosition = useRef(0);

    const searchBarDisplay = useSharedValue(1);
    const searchBarDividerDisplay = useSharedValue(1);

    const [searchBarHeight, setSearchBarHeight] = useState(0);

    const MAX_HEIGHT = heightPercentageToDP(29.5);
    const searchBarDisplayAnimationConfig = { duration: 500, easing: Easing.inOut(Easing.quad) };

    useEffect(() => {
        searchBarDividerDisplay.value = (lastScrollPosition.current <= searchBarHeight / 2) ? 1 : 0;
    }, [showItems]);

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

        listHeaderRef.current?.measure((_x, _y, _width, height, _pageX, _pageY) => {
            setSearchBarHeight(height);
        });
    }, []);

    const selectItem = useCallback((value: string) => {
        onSelect(value);
        toggleDropdown();
    }, [onSelect, toggleDropdown]);

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if(!searchBarEnable) return;
        lastScrollPosition.current = event.nativeEvent.contentOffset.y;

        if(lastScrollPosition.current > searchBarHeight / 2) {
            searchBarDisplay.value = withTiming(0, searchBarDisplayAnimationConfig);
            searchBarDividerDisplay.value = 0;
        } else {
            searchBarDisplay.value = 1;
            searchBarDividerDisplay.value = 1;
        }

        if(scrollTimeout.current) clearTimeout(scrollTimeout.current);

        runOnJS(() => {
            scrollTimeout.current = setTimeout(() => {
                if(lastScrollPosition.current <= searchBarHeight / 2) return;

                searchBarDisplay.value = withTiming(1, searchBarDisplayAnimationConfig);
            }, searchBarDisplayAnimationConfig.duration);
        })();
    }, [searchBarEnable, searchBarHeight]);

    const onStartReached = useCallback(() => {
        if(!fetchingEnabled) return;

        fetchByScrolling("prev");
    }, [fetchingEnabled, fetchByScrolling]);

    const onEndReached = useCallback(() => {
        if(!fetchingEnabled) return;

        fetchByScrolling("next");
    }, [fetchingEnabled, fetchByScrolling]);


    const keyExtractor = useCallback(
        (item: PickerItemType, index: number) => `${ item.value }-${ index.toString() }`,
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

    const floatingSearchBarStyle = useAnimatedStyle(() => {
        if(!searchBarEnable) return {};

        const translateY = interpolate(searchBarDisplay.value, [0, 1], [-100, 0]);
        return ({
            position: "absolute",
            top: 0,
            width: "100%",
            alignSelf: "center",
            gap: SEPARATOR_SIZES.lightSmall,
            paddingTop: styles.container.paddingVertical,
            paddingBottom: SEPARATOR_SIZES.lightSmall,
            backgroundColor: styles.container.backgroundColor,
            zIndex: 1,
            transform: [{ translateY }],
            opacity: searchBarDisplay.value
        });
    });

    const searchBarDividerStyle = useAnimatedStyle(() => ({
        display: searchBarDividerDisplay.value === 0 ? "none" : "flex"
    }));

    const flashListProps = useMemo((): FlashListProps<PickerItemType> => ({
        ref: flashListRef,
        data: items.filter(item => item.value !== selectedItem?.value),
        masonry,
        numColumns,
        renderItem,
        contentContainerStyle: { paddingTop: searchBarEnable && searchBarHeight - SEPARATOR_SIZES.small },
        maintainVisibleContentPosition: { disabled: true },
        drawDistance: heightPercentageToDP(100),
        keyExtractor,
        ListEmptyComponent: renderListEmptyComponent,
        ItemSeparatorComponent: renderSeparatorComponent,
        nestedScrollEnabled: true,
        decelerationRate: 0.9,
        onScroll: searchBarEnable ? onScroll : undefined,
        onStartReached,
        onStartReachedThreshold: 0.5,
        onEndReached,
        onEndReachedThreshold: 0.5,
        keyboardDismissMode: "on-drag",
        showsVerticalScrollIndicator: false,
        showsHorizontalScrollIndicator: false
    }), [
        flashListRef,
        items,
        renderItem,
        keyExtractor,
        renderListEmptyComponent,
        renderSeparatorComponent,
        searchBarEnable,
        onScroll,
        onEndReached
    ]);

    return (
        <DropdownView height={ MAX_HEIGHT } expanded={ showItems } paddingVertical={ SEPARATOR_SIZES.small }>
            {
                searchBarEnable &&
               <Animated.View ref={ listHeaderRef } style={ floatingSearchBarStyle }>
                  <SearchBar
                     term={ searchTerm }
                     setTerm={ setSearchTerm }
                     textInputProps={ {
                         placeholder: searchBarPlaceholder,
                         actionIcon: ICON_NAMES.close,
                         onAction: () => setSearchTerm(""),
                         containerStyle: {
                             backgroundColor: COLORS.gray4,
                             borderRadius: 15
                         }
                     } }
                  />
                  <Animated.View style={ searchBarDividerStyle }>
                     <Divider
                        margin={ 0 }
                        size={ "85%" }
                        color={ COLORS.gray2 }
                     />
                  </Animated.View>
               </Animated.View>
            }
            {
                isBottomSheet
                ? <BottomSheetFlashList { ...flashListProps } />
                : <FlashList { ...flashListProps } />
            }
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