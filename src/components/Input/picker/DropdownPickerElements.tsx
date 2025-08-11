import React, { useCallback, useEffect, useRef } from "react";
import PickerItem, { PickerItemType } from "./PickerItem.tsx";
import { COLORS, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import Divider from "../../Divider.tsx";

/**
 *  Renders the list of picker items within a dropdown picker.
 *
 * @component
 * @returns { ReactElement } A component that lists the dropdown picker items.
 */
function DropdownPickerElements() {
    const {
        items,
        fetchByScrolling,
        fetchingEnabled,
        selectedItem,
        searchTerm,
        showItems,
        onSelect,
        toggleDropdown
    } = useDropdownPickerContext();

    const flashListRef = useRef<FlashListRef<PickerItemType>>(null);
    const itemsFiltered = useRef(false);

    const display = useSharedValue(showItems ? 1 : 0);
    const selectedItemDisplay = useSharedValue(0);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const isProgrammaticScroll = useRef(false);
    const lastScrollPosition = useRef(0);

    const MAX_HEIGHT = heightPercentageToDP(29.5);
    const displayAnimationConfig = { duration: 350 };
    const selectedItemDisplayAnimationConfig = { duration: 500 };

    useEffect(() => {
        if(!showItems && selectedItem) selectedItemDisplay.value = 0;
        if(showItems && selectedItem && lastScrollPosition.current > (flashListRef.current.getLayout(0)?.height * 1.05 ?? 0)) {
            selectedItemDisplay.value = withTiming(1, selectedItemDisplayAnimationConfig);
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

    const selectItem = useCallback((value: string) => {
        onSelect(value);
        toggleDropdown();
    }, [onSelect, toggleDropdown]);

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

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        lastScrollPosition.current = event.nativeEvent.contentOffset.y;
        const firstItemHeight = flashListRef.current.getLayout(0)?.height * 1.05 ?? 0;

        if(lastScrollPosition.current > firstItemHeight) {
            if(!isProgrammaticScroll.current) {
                selectedItemDisplay.value = withTiming(0, selectedItemDisplayAnimationConfig);
            }
            isProgrammaticScroll.current = false;
        } else {
            selectedItemDisplay.value = 0;
        }

        if(scrollTimeout.current) clearTimeout(scrollTimeout.current);

        runOnJS((y, firstItemHeight) => {
            scrollTimeout.current = setTimeout(() => {
                if(y <= firstItemHeight) return;

                selectedItemDisplay.value = withTiming(1, selectedItemDisplayAnimationConfig);
            }, 500);
        })(lastScrollPosition.current, firstItemHeight);
    };

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

    const animatedStyle = useAnimatedStyle(() => {
        const height = interpolate(display.value, [0, 1], [0, MAX_HEIGHT]);
        const opacity = interpolate(display.value, [0, 1], [0, 1]);

        return {
            height,
            opacity
        };
    });

    const selectedItemStyle = useAnimatedStyle(() => {
        const translateY = interpolate(selectedItemDisplay.value, [0, 1], [-100, 0]);
        return ({
            position: "absolute",
            top: 0,
            width: "100%",
            alignSelf: "center",
            paddingVertical: styles.container.paddingVertical,
            backgroundColor: styles.container.backgroundColor,
            zIndex: 1,
            transform: [{ translateY }],
            opacity: selectedItemDisplay.value
        });
    });

    const data = selectedItem
                 ? [selectedItem, ...items.filter(item => item.value !== selectedItem.value)]
                 : items;

    return (
        <Animated.View style={ [animatedStyle, styles.container] }>
            {
                selectedItem &&
               <Animated.View style={ selectedItemStyle }>
                  <PickerItem
                     item={ selectedItem }
                     onPress={ () => {} }
                     selected={ true }
                  />
               </Animated.View>
            }
            <FlashList
                ref={ flashListRef }
                data={ data.length === 1 && selectedItem ? [] : data }
                renderItem={ renderItem }
                maintainVisibleContentPosition={ { disabled: true } }
                drawDistance={ heightPercentageToDP(100) }
                keyExtractor={ keyExtractor }
                ListEmptyComponent={ renderListEmptyComponent }
                ItemSeparatorComponent={ renderSeparatorComponent }
                nestedScrollEnabled
                onScroll={ onScroll }
                onStartReached={ onStartReached }
                onStartReachedThreshold={ 0.5 }
                onEndReached={ onEndReached }
                onEndReachedThreshold={ 0.5 }
                keyboardDismissMode="on-drag"
                showsHorizontalScrollIndicator={ false }
                showsVerticalScrollIndicator={ false }
            />
        </Animated.View>
    );
};

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