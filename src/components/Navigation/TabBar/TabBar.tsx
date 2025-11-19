import React from "react";
import { StyleSheet, View } from "react-native";
import TabBarIcon from "./TabBarIcon.tsx";
import {
    COLORS,
    FONT_SIZES,
    SECONDARY_COLOR,
    SEPARATOR_SIZES,
    SIMPLE_TABBAR_HEIGHT
} from "../../../constants/index.ts";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { hexToRgba } from "../../../utils/colors/hexToRgba.ts";
import { LinearGradient } from "expo-linear-gradient";
import FloatingActionMenu from "../../../ui/floatingActionMenu/components/FloatingActionMenu.tsx";
import { ACTIONS } from "../../../ui/floatingActionMenu/constants/index.ts";

function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
    const styles = useStyles(insets.bottom);

    return (
        <>
            <FloatingActionMenu
                action={ ACTIONS }
                containerStyle={ { bottom: SIMPLE_TABBAR_HEIGHT + SEPARATOR_SIZES.small + insets.bottom } }
            />
            <View style={ [styles.container] }>
                <LinearGradient
                    locations={ [0, 0.75] }
                    colors={ [
                        hexToRgba(SECONDARY_COLOR, 0.35),
                        hexToRgba(SECONDARY_COLOR, 1)
                    ] }
                    style={ StyleSheet.absoluteFillObject }
                />
                {
                    state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const icons = JSON.parse(options.tabBarIcon());

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
                                isFocused={ isFocused }
                                title={ options.title }
                                activeIcon={ icons?.["active"] }
                                inactiveIcon={ icons?.["inactive"] }
                                iconSize={ FONT_SIZES.h2 }
                                activeColor={ COLORS.white }
                                inactiveColor={ COLORS.white2 }
                                onPress={ onPress }
                                onLongPress={ onLongPress }
                            />
                        );
                    })
                }
            </View>
        </>
    );
}

const useStyles = (bottom: number) => StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        bottom: 0,
        zIndex: 1,
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",
        height: SIMPLE_TABBAR_HEIGHT + bottom,
        paddingBottom: bottom,
        gap: SEPARATOR_SIZES.small,
        width: "100%",
        backgroundColor: "transparent"
    }
});

export default TabBar;