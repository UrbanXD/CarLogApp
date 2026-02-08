import React from "react";
import { StyleSheet, View } from "react-native";
import TabBarIcon from "./TabBarIcon.tsx";
import {
    COLORS,
    GAP_BETWEEN_TABBAR_AND_FLOATING_ACTION_BUTTON,
    SECONDARY_COLOR,
    SEPARATOR_SIZES,
    SIMPLE_TABBAR_HEIGHT
} from "../../../constants";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { hexToRgba } from "../../../utils/colors/hexToRgba.ts";
import { LinearGradient } from "expo-linear-gradient";
import FloatingActionMenu from "../../../ui/floatingActionMenu/components/FloatingActionMenu.tsx";
import { useActions } from "../../../ui/floatingActionMenu/hooks/useActions.ts";

function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
    const { actions } = useActions();
    const styles = useStyles(insets.bottom);

    return (
        <>
            <FloatingActionMenu
                action={ actions }
                containerStyle={ { bottom: SIMPLE_TABBAR_HEIGHT + GAP_BETWEEN_TABBAR_AND_FLOATING_ACTION_BUTTON + insets.bottom } }
            />
            <View style={ [styles.container] }>
                <LinearGradient
                    locations={ [0, 0.65] }
                    colors={ [
                        hexToRgba(SECONDARY_COLOR, 0.5),
                        hexToRgba(SECONDARY_COLOR, 1)
                    ] }
                    style={ StyleSheet.absoluteFillObject }
                />
                {
                    state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;
                        const iconSize = 26;

                        const iconNode = options?.tabBarIcon?.({
                            focused: isFocused,
                            color: options.tabBarActiveTintColor ?? "",
                            size: iconSize
                        });

                        const icons = typeof iconNode === "string" ? JSON.parse(iconNode) : {};

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
                                title={ options.title ?? "??" }
                                activeIcon={ icons?.["active"] }
                                inactiveIcon={ icons?.["inactive"] }
                                iconSize={ 26 }
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
        gap: SEPARATOR_SIZES.lightSmall,
        width: "100%",
        backgroundColor: "transparent"
    }
});

export default TabBar;