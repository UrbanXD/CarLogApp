import React, { useCallback, useEffect, useMemo, useRef } from "react";
import PickerItem, { PickerItemType } from "./PickerItem.tsx";
import { COLORS, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { BottomSheetFlashList, useBottomSheetInternal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import {
    BottomSheetFlashListProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";

const DropdownPickerElements: React.FC = () => {
    const flashListRef = useRef<FlashList>(null);
    const {
        items,
        fetchByScrolling,
        selectedItem,
        itemsFiltered,
        setItemsFiltered,
        showItems,
        onSelect,
        toggleDropdown
    } = useDropdownPickerContext();
    const bottomSheet = useBottomSheetInternal(true);
    const isInsideBottomSheet = !!bottomSheet;

    const display = useSharedValue(showItems ? 1 : 0);

    const MAX_HEIGHT = heightPercentageToDP(29.5);
    const animationConfig = { duration: 350 };

    const animatedStyle = useAnimatedStyle(() => {
        const height = interpolate(display.value, [0, 1], [0, MAX_HEIGHT]);
        const opacity = interpolate(display.value, [0, 1], [0, 1]);

        return {
            height,
            opacity
        };
    });

    useEffect(() => {
        display.value = withTiming(showItems ? 1 : 0, animationConfig);
        if(!showItems) return;

        const selectedItemIndex = items.findIndex(item => item.value === selectedItem?.value);
        if(selectedItemIndex === -1) return;

        setTimeout(() => {
            flashListRef.current?.scrollToIndex({ index: selectedItemIndex, animated: true });
        }, 100);
    }, [showItems]);

    useEffect(() => {
        if(!itemsFiltered) return;

        setItemsFiltered(false);
        flashListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, [items]);

    const selectItem = useCallback((value: string) => {
        onSelect(value);
        toggleDropdown();
    }, [onSelect, toggleDropdown]);

    const renderItem = useCallback(
        (arg: { extraData?: string, item: PickerItemType, index: number }) => (
            <PickerItem
                item={ arg.item }
                onPress={ () => selectItem(arg.item.value) }
                selected={ arg.item.value === arg?.extraData }
            />
        ),
        [selectItem]
    );

    const renderSeparatorComponent = useCallback(() => <View style={ { height: SEPARATOR_SIZES.small } }/>, []);

    const renderListEmptyComponent = useCallback(
        () => <Text style={ styles.notFoundText }>Nem található elem...</Text>,
        []
    );

    const onEndReached = useCallback(() => {
        if(itemsFiltered || !fetchByScrolling) return;
        fetchByScrolling();
    }, [itemsFiltered, fetchByScrolling]);

    const keyExtractor = useCallback(
        (item: PickerItemType, index: number) => `${ item.value }-${ index.toString() }`,
        []
    );

    const onScrollToIndexFailed = (info: any) => {
        setTimeout(() => {
            flashListRef.current?.scrollToIndex({ index: info.index, animated: true });
        }, 100);
    };

    const flashListConfig: BottomSheetFlashListProps = useMemo(() => ({
        ref: flashListRef,
        data: items,
        renderItem,
        extraData: selectedItem?.value,
        estimatedItemSize: 66,
        ItemSeparatorComponent: renderSeparatorComponent,
        ListEmptyComponent: renderListEmptyComponent,
        onEndReached,
        onEndReachedThreshold: 0.5,
        maxToRenderPerBatch: 50,
        initialNumToRender: 50,
        keyboardDismissMode: "on-drag",
        keyExtractor,
        nestedScrollEnabled: true,
        onScrollToIndexFailed,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false
    }), [
        items,
        renderItem,
        renderSeparatorComponent,
        renderListEmptyComponent,
        selectItem,
        onEndReached,
        keyExtractor,
        onScrollToIndexFailed
    ]);

    return (
        <Animated.View style={ [animatedStyle, styles.container] }>
            <View style={ styles.container.flashListWrapper }>
                {
                    isInsideBottomSheet
                    ? <BottomSheetFlashList { ...flashListConfig }/>
                    : <FlashList { ...flashListConfig } />

                }
            </View>
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
        borderBottomRightRadius: 25,

        flashListWrapper: {
            minHeight: 2, //for satisfies flashList minHeight (at least 2px)
            height: "100%",
            width: "100%"
        }
    },
    notFoundText: {
        ...GLOBAL_STYLE.containerText,
        flexGrow: 1,
        textAlign: "center",
        textAlignVertical: "center"
    }
});

export default DropdownPickerElements;