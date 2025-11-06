import React, { ReactElement } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { formTheme } from "../../../../ui/form/constants/theme.ts";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import Divider from "../../../Divider.tsx";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withTiming
} from "react-native-reanimated";
import SearchBar from "../../../SearchBar.tsx";
import Icon from "../../../Icon.tsx";

type DropdownPickerSearchBarProps = {
    title?: string
    renderCreateItemForm?: () => ReactElement
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
    searchBarEnabled: boolean
    searchBarPlaceholder?: string
}

export function DropdownPickerHeader({
    title,
    renderCreateItemForm,
    searchTerm,
    setSearchTerm,
    searchBarEnabled,
    searchBarPlaceholder
}: DropdownPickerSearchBarProps) {
    const searchBarOpened = useSharedValue(1);
    const searchBarHeight = useSharedValue(0);
    const formHeight = useSharedValue(0);
    const rotated = useDerivedValue(() => {
        return withTiming(
            interpolate(searchBarOpened.value, [0, 1], [45, 0]),
            { duration: 150 }
        );
    });

    const onToggle = () => {
        searchBarOpened.value = searchBarOpened.value === 1 ? 0 : 1;
    };

    const onSearchBarLayout = (event: LayoutChangeEvent) => searchBarHeight.value = event.nativeEvent.layout.height;

    const onFormLayout = (event: LayoutChangeEvent) => formHeight.value = event.nativeEvent.layout.height;

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${ rotated.value }deg` }]
    }));

    const inputContainerAnimatedStyle = useAnimatedStyle(() => {
        const height = withDelay(
            150,
            withTiming(searchBarOpened.value === 0 ? formHeight.value : searchBarHeight.value, { duration: 300 })
        );

        return { height };
    });

    const searchBarAnimatedStyle = useAnimatedStyle(() => {
        const opacity = withDelay(searchBarOpened.value === 1 ? 150 : 0, withTiming(
            interpolate(searchBarOpened.value, [1, 0], [1, 0]),
            { duration: 300 }
        ));

        return ({
            opacity,
            pointerEvents: searchBarOpened.value === 0 ? "none" : "auto"
        });
    });

    const formAnimatedStyle = useAnimatedStyle(() => {
        const opacity = withDelay(searchBarOpened.value === 0 ? 150 : 0, withTiming(
            interpolate(searchBarOpened.value, [1, 0], [0, 1]),
            { duration: 300 }
        ));

        return ({
            opacity,
            pointerEvents: searchBarOpened.value === 1 ? "none" : "auto"
        });
    });

    return (
        <View style={ styles.container }>
            {
                title &&
               <Text style={ styles.title }>{ title }</Text>
            }
            <View style={ styles.contentContainer }>
                {
                    renderCreateItemForm &&
                   <Pressable onPress={ onToggle }>
                      <Animated.View style={ [styles.iconContainer, iconAnimatedStyle] }>
                         <Icon
                            icon={ ICON_NAMES.add }
                            size={ formTheme.iconSize * 0.85 }
                            color={ COLORS.gray1 }
                         />
                      </Animated.View>
                   </Pressable>

                }
                <Animated.View style={ [inputContainerAnimatedStyle, styles.inputContainer] }>
                    <View style={ styles.content }>
                        <Animated.View style={ [searchBarAnimatedStyle] } onLayout={ onSearchBarLayout }>
                            <SearchBar
                                term={ searchTerm }
                                setTerm={ setSearchTerm }
                                textInputProps={ {
                                    placeholder: searchBarPlaceholder,
                                    actionIcon: ICON_NAMES.close,
                                    onAction: () => setSearchTerm("")
                                } }
                            />
                        </Animated.View>
                    </View>
                    <View style={ styles.content }>
                        <Animated.View style={ formAnimatedStyle } onLayout={ onFormLayout }>
                            { renderCreateItemForm && renderCreateItemForm() }
                        </Animated.View>
                    </View>
                </Animated.View>
            </View>
            {
                (searchBarEnabled || renderCreateItemForm) &&
               <Divider
                  margin={ 0 }
                  size={ "85%" }
                  color={ formTheme.activeColor }
               />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        paddingBottom: SEPARATOR_SIZES.lightSmall
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center"
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        overflow: "hidden"
    },
    content: {
        position: "absolute",
        width: "100%"
    },
    inputContainer: {
        flex: 1,
        position: "relative"
    },
    iconContainer: {
        width: formTheme.iconSize * 1.15,
        height: formTheme.iconSize * 1.15,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: formTheme.containerBackgroundColor,
        borderColor: formTheme.borderColor,
        borderWidth: 1.5
    },
    button: {
        borderWidth: 2,
        borderColor: COLORS.fuelYellow
    }
});