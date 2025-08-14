import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import PickerItem, { PickerItemType } from "./PickerItem.tsx";
import { COLORS, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { FlashList, FlashListProps, FlashListRef } from "@shopify/flash-list";
import Divider from "../../Divider.tsx";
import { BottomSheetFlashList, useBottomSheetInternal } from "@gorhom/bottom-sheet";
import SearchBar from "../../SearchBar.tsx";
import { AnimatedPressable } from "../../AnimatedComponents/index.ts";

type DropdownPickerElementsProps = {
    searchBarPlaceholder?: string
}

/**
 *  Renders the list of picker items within a dropdown picker.
 *
 * @component
 * @returns { ReactElement } A component that lists the dropdown picker items.
 */
function DropdownPickerElements({ searchBarPlaceholder }: DropdownPickerElementsProps) {
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
        setSearchTerm
    } = useDropdownPickerContext();

    const flashListRef = useRef<FlashListRef<PickerItemType>>(null);
    const listHeaderRef = useRef<AnimatedPressable>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const itemsFiltered = useRef(false);
    const isProgrammaticScroll = useRef(false);
    const lastScrollPosition = useRef(0);

    const display = useSharedValue(showItems ? 1 : 0);
    const searchBarDisplay = useSharedValue(1);
    const listHeaderHeight = useSharedValue(0);

    const MAX_HEIGHT = heightPercentageToDP(29.5);
    const displayAnimationConfig = {
        duration: 350,
        easing: Easing.out(Easing.ease)
    };
    const selectedItemDisplayAnimationConfig = {
        duration: 500,
        easing: Easing.inOut(Easing.quad)
    };

    useEffect(() => {
        if(!showItems && selectedItem) searchBarDisplay.value = 0;
        if(showItems && selectedItem && lastScrollPosition.current > (listHeaderHeight.value)) {
            searchBarDisplay.value = withTiming(1, selectedItemDisplayAnimationConfig);
        }
    }, [selectedItem, showItems]);

    useEffect(() => {
        display.value = withTiming(showItems ? 1 : 0, displayAnimationConfig);
    }, [showItems]);

    useEffect(() => {
        itemsFiltered.current = true;
    }, [searchTerm]);

    useEffect(() => {
        if(!itemsFiltered.current) return;

        itemsFiltered.current = false;
        isProgrammaticScroll.current = true;
        flashListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, [items]);

    useLayoutEffect(() => {
        listHeaderRef.current?.measure((_x, _y, _width, height, _pageX, _pageY) => {
            listHeaderHeight.value = height;
        });
    }, []);

    const selectItem = useCallback((value: string) => {
        onSelect(value);
        toggleDropdown();
    }, [onSelect, toggleDropdown]);

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        lastScrollPosition.current = event.nativeEvent.contentOffset.y;
        const firstItemHeight = listHeaderHeight.value;

        if(lastScrollPosition.current > firstItemHeight) {
            if(!isProgrammaticScroll.current) {
                searchBarDisplay.value = withTiming(0, selectedItemDisplayAnimationConfig);
            }
            isProgrammaticScroll.current = false;
        } else {
            searchBarDisplay.value = 0;
        }

        if(scrollTimeout.current) clearTimeout(scrollTimeout.current);

        runOnJS((y, firstItemHeight) => {
            scrollTimeout.current = setTimeout(() => {
                if(y <= firstItemHeight) return;

                searchBarDisplay.value = withTiming(1, selectedItemDisplayAnimationConfig);
            }, 500);
        })(lastScrollPosition.current, firstItemHeight);
    }, []);

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
        (arg: { item: PickerItemType, index: number }) => (
            <PickerItem
                item={ arg.item }
                onPress={ () => selectItem(arg.item.value) }
                selected={ arg.item.value === selectedItem?.value }
            />
        ),
        [selectItem, selectedItem]
    );

    const renderSeparatorComponent = useCallback(
        () => <View style={ { height: SEPARATOR_SIZES.small } }/>,
        []
    );

    const renderListHeaderComponent = useCallback(
        () => (
            <>
                <SearchBar
                    term={ searchTerm }
                    setTerm={ setSearchTerm }
                    textInputProps={ {
                        placeholder: searchBarPlaceholder,
                        containerStyle: {
                            backgroundColor: COLORS.gray4,
                            borderRadius: 15
                        }
                    } }
                />
                <Divider margin={ SEPARATOR_SIZES.small } size={ "85%" } color={ COLORS.gray2 }/>
            </>
        ),
        [searchTerm]
    );

    const renderListEmptyComponent = useCallback(
        () => (
            <>
                {
                    selectedItem &&
                   <>
                      <PickerItem
                         item={ selectedItem }
                         onPress={ () => {} }
                         selected={ true }
                      />
                      <Divider size={ "95%" } color={ COLORS.gray1 } margin={ SEPARATOR_SIZES.small }/>
                   </>
                }
                <Text style={ styles.notFoundText }>Nem található elem...</Text>
            </>
        ),
        [selectedItem]
    );

    const animatedStyle = useAnimatedStyle(() => ({
        height: display.value * MAX_HEIGHT,
        opacity: display.value,
        paddingVertical: display.value * SEPARATOR_SIZES.small
    }));

    const floatingSearchBarStyle = useAnimatedStyle(() => {
        const translateY = interpolate(searchBarDisplay.value, [0, 1], [-100, 0]);
        return ({
            position: "absolute",
            top: 0,
            width: "100%",
            alignSelf: "center",
            paddingTop: styles.container.paddingVertical,
            paddingBottom: SEPARATOR_SIZES.lightSmall,
            backgroundColor: styles.container.backgroundColor,
            zIndex: 1,
            transform: [{ translateY }],
            opacity: searchBarDisplay.value
        });
    });

    const flashListProps = useMemo((): FlashListProps<PickerItemType> => ({
        ref: flashListRef,
        data: items.filter(item => item.value !== selectedItem?.value),
        renderItem,
        maintainVisibleContentPosition: { disabled: true },
        drawDistance: heightPercentageToDP(100),
        keyExtractor,
        ListEmptyComponent: renderListEmptyComponent,
        ListHeaderComponent: renderListHeaderComponent,
        ItemSeparatorComponent: renderSeparatorComponent,
        nestedScrollEnabled: true,
        decelerationRate: 0.9,
        onScroll,
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
        onScroll,
        onScroll,
        onEndReached
    ]);

    return (
        <Animated.View style={ [animatedStyle, styles.container] }>
            <AnimatedPressable
                ref={ listHeaderRef }
                onPress={ () => { console.log("f gseg"); } }
                style={ floatingSearchBarStyle }
            >
                <SearchBar
                    term={ searchTerm }
                    setTerm={ setSearchTerm }
                    textInputProps={ {
                        placeholder: searchBarPlaceholder,
                        containerStyle: {
                            backgroundColor: COLORS.gray4,
                            borderRadius: 15
                        },
                        editable: false
                    } }
                />
            </AnimatedPressable>
            {
                isBottomSheet
                ? <BottomSheetFlashList { ...flashListProps } />
                : <FlashList { ...flashListProps } />
            }
        </Animated.View>
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

export default DropdownPickerElements;