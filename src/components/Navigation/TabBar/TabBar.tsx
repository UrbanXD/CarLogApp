import React from "react";
import { StyleSheet } from "react-native";
import TabBarIcon from "./TabBarIcon.tsx";
import { COLORS, FONT_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../constants/index.ts";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { hexToRgba } from "../../../utils/colors/hexToRgba.ts";
import { LinearGradient } from "expo-linear-gradient";
import FloatingActionMenu from "../../../ui/floatingActionMenu/components/FloatingActionMenu.tsx";

function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
    return (
        <>
            <FloatingActionMenu/>
            <SafeAreaView style={ [styles.container, { paddingBottom: insets.bottom }] }>
                <LinearGradient
                    locations={ [0, 0.75] }
                    colors={ [
                        hexToRgba(COLORS.black2, 0.35),
                        hexToRgba(COLORS.black2, 1)
                    ] }
                    style={ StyleSheet.absoluteFillObject }
                />
                {
                    state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const icons = JSON.parse(options.tabBarIcon());
                        const icon = icons?.[isFocused ? "active" : "inactive"] ?? "help";

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true
                            });

                            if(!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
                        };

                        const onLongPress = () => navigation.emit({ type: "tabLongPress", target: route.key });

                        return (
                            <TabBarIcon
                                key={ index }
                                title={ options.title }
                                iconName={ icon }
                                iconSize={ FONT_SIZES.h2 }
                                iconColor={ COLORS.white }
                                onPress={ onPress }
                                onLongPress={ onLongPress }
                            />
                        );
                    })
                }
            </SafeAreaView>
        </>
    );
};

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
        width: "100%",
        backgroundColor: "transparent"
    }
});

export default TabBar;