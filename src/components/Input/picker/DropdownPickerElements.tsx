import React, { useCallback, useEffect, useRef } from "react";
import { FlatList } from "react-native-gesture-handler";
import PickerItem, { PickerElement } from "./PickerItem.tsx";
import { COLORS, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet, Text } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";

const DropdownPickerElements: React.FC = () => {
    const flatListRef = useRef<FlatList>(null);
    const {
        elements,
        selectedElement,
        showElements,
        onSelect,
        horizontal,
        toggleDropdown
    } = useDropdownPickerContext();

    const display = useSharedValue(showElements ? 1 : 0);

    const MAX_HEIGHT = heightPercentageToDP(29.5);
    const animationConfig = {
        duration: 350
    };

    const animatedStyle = useAnimatedStyle(() => {
        const interpolatedValue = interpolate(display.value, [0, 1], [0, !horizontal ? MAX_HEIGHT : 1]);
        const opacity = interpolate(display.value, [0, 1], [0.35, 1]);

        if(!horizontal) return {
            height: interpolatedValue,
            opacity
        };

        return {
            flex: interpolatedValue,
            width: interpolatedValue === 0 && 0,
            height: interpolatedValue === 0 ? 0 : "100%",
            opacity
        };
    });

    useEffect(() => {
        display.value = withTiming(showElements ? 1 : 0, animationConfig);
        if(!showElements) return;

        const selectedItemIndex = elements.findIndex(element => element.value === selectedElement?.value);
        if(selectedItemIndex === -1) return;

        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: selectedItemIndex, animated: true });
        }, 100);
    }, [showElements]);

    const selectElement = useCallback((value: string) => {
        onSelect(value);
        toggleDropdown();
    }, [onSelect, toggleDropdown]);

    const renderItem = useCallback((arg: { item: PickerElement, index: number }) => {
        return (
            <PickerItem
                key={ arg.index }
                element={ arg.item }
                onPress={ () => selectElement(arg.item.value) }
                selected={ arg.item.value === selectedElement?.value }
            />
        );
    }, [selectedElement, selectElement]);

    const renderListEmptyComponent = useCallback(() => {
        return (
            <Text style={ styles.notFoundText }>Nem található elem...</Text>
        );
    }, []);

    const keyExtractor = (item: PickerElement) => item.value;

    const onScrollToIndexFailed = (info: any) => {
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
        }, 100);
    };

    // if(!showElements && horizontal) {
    //     return (
    //         <></>
    //     );
    // }

    return (
        <Animated.View style={ [animatedStyle, styles.container, horizontal && styles.horizontalContainer] }>
            <FlatList
                ref={ flatListRef }
                data={ elements }
                renderItem={ renderItem }
                ListEmptyComponent={ renderListEmptyComponent }
                keyExtractor={ keyExtractor }
                onScrollToIndexFailed={ onScrollToIndexFailed }
                horizontal={ horizontal }
                showsHorizontalScrollIndicator={ false }
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={ [styles.elementsContainer, horizontal && styles.horizontalElementsContainer] }
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0.01,
        overflow: "hidden",
        marginHorizontal: SEPARATOR_SIZES.mediumSmall,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    horizontalContainer: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    elementsContainer: {
        flexGrow: 1,
        gap: SEPARATOR_SIZES.small,
        paddingVertical: SEPARATOR_SIZES.small,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall,
        backgroundColor: COLORS.gray5
    },
    horizontalElementsContainer: {
        backgroundColor: "transparent",
        paddingVertical: 0
    },
    notFoundText: {
        ...GLOBAL_STYLE.containerText,
        flexGrow: 1,
        textAlign: "center",
        textAlignVertical: "center"
    }
});

export default DropdownPickerElements;