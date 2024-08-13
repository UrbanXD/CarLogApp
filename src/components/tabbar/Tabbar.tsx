import React, {useEffect, useState} from "react";
import {Dimensions, StyleSheet, View, ViewStyle} from "react-native";
import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import TabBarIcon from "./TabBarIcon";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import hexToRgba from "hex-to-rgba";
import {theme} from "../../constants/theme";
import {LinearGradient} from "expo-linear-gradient";
import createAnimatedComponent = Animated.createAnimatedComponent;
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {FONT_SIZES, ICON_COLORS, SIMPLE_TABBAR_HEIGHT} from "../../constants/constants";
import {MaterialTopTabBarProps} from "@react-navigation/material-top-tabs";

interface TabBarProps{
    tabBarStyle?: ViewStyle,
    tabBarActiveTintColor?: string,
    tabBarInactiveTintColor?: string,
}

const TabBar: React.FC<MaterialTopTabBarProps & TabBarProps> = ({ state, descriptors, navigation, tabBarStyle = {}, tabBarActiveTintColor = ICON_COLORS.active, tabBarInactiveTintColor = ICON_COLORS.inactive }) => {
    const TAB_BAR_WIDTH =  Dimensions.get("screen").width
    const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;

    const slideAnimationStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: withTiming(TAB_WIDTH * state.index)
            }]
        }
    });

    return (
        <View style={ [styles.container, tabBarStyle] }>
            <Animated.View style={ [styles.slidingElementContainer, { width: TAB_WIDTH }, slideAnimationStyle] }>
                <View style={ styles.slidingElement } />
            </Animated.View>
            {
                state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const color = isFocused ? tabBarActiveTintColor : tabBarInactiveTintColor

                    const icon =
                        options.tabBarIcon
                            ? options.tabBarIcon({
                                focused: isFocused,
                                color: isFocused ? tabBarActiveTintColor : tabBarInactiveTintColor,
                                // size: 25,
                              }) as string
                            : "home"

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarIcon
                            key={ index }
                            title={ options.title || route.name }
                            textColor={ color }
                            focused={ isFocused }
                            focusedColor={ color }
                            iconName={ icon }
                            onPress={ onPress }
                            onLongPress={ onLongPress }
                            width={ TAB_WIDTH }
                        />
                    );
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",
        height: SIMPLE_TABBAR_HEIGHT,
        backgroundColor: theme.colors.black2,
        borderColor: theme.colors.gray2,
        borderBottomWidth: 2.5,
    },
    titleText: {
        fontSize: FONT_SIZES.normal,
        alignItems: "center"
    },
    slidingElementContainer: {
        ...StyleSheet.absoluteFillObject,
        top: "100%"
    },
    slidingElement: {
        width: "100%",
        height: 5,
        backgroundColor: theme.colors.fuelYellow
    }
})

export default TabBar;