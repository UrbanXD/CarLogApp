import React from "react";
import { Dimensions, SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";
import TabBarIcon from "./TabBarIcon";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { COLORS, FONT_SIZES, ICON_COLORS, SIMPLE_TABBAR_HEIGHT } from "../../../../constants/index.ts";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useScreenScrollView } from "../../../ScreenScrollView/context/ScreenScrollViewProvider.tsx";

interface TabBarProps{
    tabBarStyle?: ViewStyle,
    tabBarActiveTintColor?: string,
}

const TabBar: React.FC<BottomTabBarProps & TabBarProps> = ({
    state,
    descriptors,
    navigation,
    tabBarStyle = {},
    tabBarActiveTintColor = ICON_COLORS.active
}) => {
    const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
    const { offset } = useScreenScrollView();

    const TAB_BAR_WIDTH =  Dimensions.get("screen").width;
    const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;

    const slideAnimationStyle = useAnimatedStyle(() => {
        const translateX = withTiming(TAB_WIDTH * state.index);
        return {
            transform: [{ translateX }]
        }
    });
    const animatedStyle = useAnimatedStyle(() => {
        const translateY = withTiming(
            interpolate(
                offset.value,
                [0, SIMPLE_TABBAR_HEIGHT],
                [0, SIMPLE_TABBAR_HEIGHT * 2],
                Extrapolation.CLAMP
            ),
            { duration: 750 }
        );

        const opacity = withTiming(
            interpolate(
                offset.value,
                [0, SIMPLE_TABBAR_HEIGHT],
                [1, 0.15],
                Extrapolation.CLAMP
            ),
            { duration: 750 }
        )

        return {
            transform: [{ translateY }],
            opacity,
        };
    });
    return (
        <AnimatedSafeAreaView style={ [styles.container, tabBarStyle, animatedStyle] }>
            <Animated.View style={ [styles.slidingElementContainer, { width: TAB_WIDTH }, slideAnimationStyle] }>
                <View style={ styles.slidingElement } />
            </Animated.View>
            {
                state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const icons =
                        JSON.parse(
                            options.tabBarIcon
                                ?   options.tabBarIcon({
                                        focused: isFocused,
                                        color: isFocused ? tabBarActiveTintColor : "red",
                                        size: 500,
                                    }) as string
                                :   "help"
                        )

                    const icon = icons[isFocused ? "active" : "inactive"]

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarIcon
                            key={ index }
                            iconName={ icon }
                            iconSize={ FONT_SIZES.h2 }
                            iconColor={ COLORS.gray1 }
                            focused={ isFocused }
                            width={ TAB_WIDTH }
                            onPress={ onPress }
                            onLongPress={ onLongPress }
                        />
                    );
                })
            }
        </AnimatedSafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        bottom: 0,
        zIndex: 1,
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",
        height: SIMPLE_TABBAR_HEIGHT,
        backgroundColor: COLORS.black2,
        borderColor: COLORS.gray4,
        borderWidth: 0.5,
        // borderBottomWidth: 2.5,
        borderTopStartRadius: 45,
        borderTopEndRadius: 45,
    },
    titleText: {
        fontSize: FONT_SIZES.p1,
        alignItems: "center"
    },
    slidingElementContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
    },
    slidingElement: {
        width: "100%",
        height: 2,
        backgroundColor: COLORS.gray1
    }
})

export default TabBar;