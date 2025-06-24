import React, { useCallback, useEffect, useRef } from "react";
import { FlatList } from "react-native-gesture-handler";
import PickerItem, { PickerElement } from "./PickerItem.tsx";
import { COLORS, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet, Text } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";

interface DropdownPickerElementsProps {
    horizontal?: boolean;
}

const DropdownPickerElements: React.FC<DropdownPickerElementsProps> = ({
    horizontal
}) => {
    const flatListRef = useRef<FlatList>(null);
    const {
        elements,
        selectedElement,
        showElements,
        onSelect,
        toggleDropdown
    } = useDropdownPickerContext();
    const display = useSharedValue(showElements ? 1 : 0);

    const MAX_HEIGHT = heightPercentageToDP(29.5); // max magasság pixelben

    const animatedStyle = useAnimatedStyle(() => {
        const interpolatedHeight = interpolate(display.value, [0, 1], [0, MAX_HEIGHT]);

        return { height: interpolatedHeight };
    });

    useEffect(() => {
        display.value = withTiming(showElements ? 1 : 0, { duration: 250 });
        if(!showElements) return;

        const selectedItemIndex = elements.findIndex(element => element.id === selectedElement?.id);
        if(selectedItemIndex === -1) return;

        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: selectedItemIndex, animated: true });
        }, 100);
    }, [showElements]);

    const selectElement = (id: string) => {
        onSelect(id);
        toggleDropdown();
    };

    const renderItem = useCallback((arg: { item: PickerElement, index: number }) => {
        return (
            <PickerItem
                key={ arg.index }
                element={ arg.item }
                onPress={ () => selectElement(arg.item.id) }
                selected={ arg.item.id === selectedElement?.id }
            />
        );
    }, [selectedElement]);

    const renderListEmptyComponent = useCallback(() => {
        return (
            <Text style={ styles.notFoundText }>Nem található elem...</Text>
        );
    }, []);

    const keyExtractor = (item: PickerElement) => item.id;

    const onScrollToIndexFailed = (info: any) => {
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
        }, 100);
    };

    return (
        <Animated.View style={ [animatedStyle, styles.container] }>
            {
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
                    contentContainerStyle={ styles.elementsContainer }
                />
            }
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        marginHorizontal: SEPARATOR_SIZES.mediumSmall,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25
    },
    elementsContainer: {
        flexGrow: 1,
        gap: SEPARATOR_SIZES.small,
        paddingVertical: SEPARATOR_SIZES.small,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall,
        backgroundColor: COLORS.gray5
    },
    notFoundText: {
        ...GLOBAL_STYLE.containerText,
        flexGrow: 1,
        textAlign: "center",
        textAlignVertical: "center"
    }
});

export default DropdownPickerElements;