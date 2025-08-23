import Animated, {
    AnimatedRef,
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
import FloatingView from "../../floatingView/FloatingView.tsx";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import SearchBar from "../../SearchBar.tsx";
import Divider from "../../Divider.tsx";

type DropdownPickerSearchBarProps = {
    ref: AnimatedRef<Animated.View>
    scrollY: SharedValue<number>
    searchBarPlaceholder?: string
    style?: ViewStyle
}

function DropdownPickerSearchBar({
    ref,
    scrollY,
    searchBarPlaceholder,
    style
}: DropdownPickerSearchBarProps) {
    const { searchTerm, setSearchTerm } = useDropdownPickerContext();

    const [height, setHeight] = useState(0);

    const dividerDisplay = useSharedValue(1);

    useLayoutEffect(() => {
        ref.current?.measure((_x, _y, _width, layoutHeight, _pageX, _pageY) => {
            setHeight(layoutHeight);
        });
    }, []);

    useAnimatedReaction(
        () => scrollY.value,
        (currentY) => {
            if(currentY > height) {
                dividerDisplay.value = 0; //hide
            } else {
                dividerDisplay.value = 1;
            }
        }
    );

    const dividerStyle = useAnimatedStyle(() => ({
        display: dividerDisplay.value === 0 ? "none" : "flex"
    }));

    return (
        <FloatingView
            ref={ ref }
            top={ 0 }
            hiddenOnScroll
            hideAnimationThresholdY={ height / 2 }
            hideAnimationDirection="up"
            hideAnimationDistance={ height / 2 }
            scrollY={ scrollY }
            style={ [styles.container, style] }
        >
            <>
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
                <Animated.View style={ dividerStyle }>
                    <Divider
                        margin={ 0 }
                        size={ "85%" }
                        color={ COLORS.gray2 }
                    />
                </Animated.View>
            </>
        </FloatingView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        paddingBottom: SEPARATOR_SIZES.lightSmall
    }
});

export default DropdownPickerSearchBar;