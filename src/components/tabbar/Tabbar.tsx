import React, {useEffect, useState} from "react";
import {Dimensions, View, ViewStyle} from "react-native";
import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import TabbarIcon from "./TabbarIcon";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {bottomTabStyles} from "../../styles/bottomTabs.style";
import hexToRgba from "hex-to-rgba";
import {theme} from "../../styles/theme";
import {LinearGradient} from "expo-linear-gradient";
import createAnimatedComponent = Animated.createAnimatedComponent;

interface TabBarProps{
    tabBarStyle: ViewStyle,
    tabBarActiveTintColor: string,
    tabBarInactiveTintColor: string,
}

const Tabbar: React.FC<BottomTabBarProps & TabBarProps> = ({ state, descriptors, navigation, tabBarStyle, tabBarActiveTintColor, tabBarInactiveTintColor }) => {
    const MARGIN = 20
    const TAB_BAR_WIDTH =  Dimensions.get("screen").width - 2 * MARGIN
    const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;

    const glow = useSharedValue(0);
    useEffect(() => {
        glow.value = 0
        glow.value = withSpring(
            1,
            { duration: 5000 }
        )
    }, [state.index]);

    const AnimatedLinearGradient = createAnimatedComponent(LinearGradient);

    const slideAnimationStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: withTiming(TAB_WIDTH * state.index)}]
        }
    });

    const glowingAnimationStyle = useAnimatedStyle(() => {
        const opacityValue = interpolate(
            glow.value,
            [0, 0.25, 0.5, 0.75, 1],
            [0.5, 0, 0.75, 0.25, 1]
        )
        return {
            opacity: opacityValue
        }
    })

    return (
        <View style={ [tabBarStyle, { width: TAB_BAR_WIDTH, bottom: MARGIN }] }>
            <Animated.View style={ [bottomTabStyles.slidingElementContainerStyle, { width: TAB_WIDTH }, slideAnimationStyle] }>
                <View style={ bottomTabStyles.slidingElementStyle }></View>
                <AnimatedLinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={ [0, 0.75] }
                    colors={[ hexToRgba(theme.colors.primaryColor, 0.25), "transparent" ]}
                    style={[{
                        height: "65%",
                        borderBottomRightRadius: 50,
                        borderBottomLeftRadius: 50
                    }, glowingAnimationStyle]}
                />
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
                                size: 25,
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
                        <TabbarIcon
                            key={ index }
                            title={ options.title || route.name }
                            textColor={ color }
                            focused={ isFocused }
                            focusedColor={ color }
                            iconName={ icon }
                            onPress={ onPress }
                            onLongPress={ onLongPress }
                            width={ TAB_WIDTH }
                        ></TabbarIcon>
                    );
                })
            }
        </View>
    )
}

export default Tabbar;