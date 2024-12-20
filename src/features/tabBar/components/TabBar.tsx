import React from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";
import TabBarIcon from "./TabBarIcon";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { theme } from "../../core/constants/theme";
import { FONT_SIZES, ICON_COLORS, SIMPLE_TABBAR_HEIGHT } from "../../core/constants/constants";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface TabBarProps{
    tabBarStyle?: ViewStyle,
    tabBarActiveTintColor?: string,
    tabBarInactiveTintColor?: string,
}

const TabBar: React.FC<BottomTabBarProps & TabBarProps> = ({
    state,
    descriptors,
    navigation,
    tabBarStyle = {},
    tabBarActiveTintColor = ICON_COLORS.active,
    tabBarInactiveTintColor = ICON_COLORS.inactive
}) => {
    const TAB_BAR_WIDTH =  Dimensions.get("screen").width
    const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;

    const slideAnimationStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: withTiming(TAB_WIDTH * state.index) }]
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
                            iconName={ icon }
                            iconSize={ FONT_SIZES.medium }
                            iconColor={ theme.colors.black }
                            focused={ isFocused }
                            width={ TAB_WIDTH }
                            onPress={ onPress }
                            onLongPress={ onLongPress }
                        />
                    );
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",
        height: SIMPLE_TABBAR_HEIGHT,
        backgroundColor: theme.colors.fuelYellow,
        borderWidth: 3.5,
        borderBottomWidth: 0,
        borderColor: theme.colors.black5,
        borderTopRightRadius: 45,
        borderTopLeftRadius: 45,
    },
    titleText: {
        fontSize: FONT_SIZES.normal,
        alignItems: "center"
    },
    slidingElementContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
    },
    slidingElement: {
        width: "100%",
        height: hp(0.5),
        backgroundColor: theme.colors.black5
    }
})

export default TabBar;