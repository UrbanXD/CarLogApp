import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import TabBarIcon from "./TabBarIcon";
import FloatingActionMenu from "../../../ui/floatingActionMenu/components/FloatingActionMenu";
import { useActions } from "../../../ui/floatingActionMenu/hooks/useActions";
import {
    COLORS,
    GAP_BETWEEN_TABBAR_AND_FLOATING_ACTION_BUTTON,
    SECONDARY_COLOR,
    SEPARATOR_SIZES,
    SIMPLE_TABBAR_HEIGHT
} from "../../../constants";
import { hexToRgba } from "../../../utils/colors/hexToRgba";

function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
    const { width } = useWindowDimensions();
    const { actions } = useActions();
    if(width >= 1040) {
        return <FloatingActionMenu action={ actions } containerStyle={ { bottom: 28, right: 32 } }/>;
    }

    const isCompact = width <= 760;
    const dockWidth = isCompact ? width : Math.min(760, width - 40);
    const dockBottom = isCompact ? insets.bottom : 16;
    const styles = useStyles(dockWidth, dockBottom, isCompact, insets.bottom);

    return (
        <>
            <FloatingActionMenu
                action={ actions }
                containerStyle={ {
                    bottom: SIMPLE_TABBAR_HEIGHT + GAP_BETWEEN_TABBAR_AND_FLOATING_ACTION_BUTTON + dockBottom
                } }
            />
            <View style={ styles.container }>
                <LinearGradient
                    locations={ [0, 0.65] }
                    colors={ [hexToRgba(SECONDARY_COLOR, 0.5), hexToRgba(SECONDARY_COLOR, 1)] }
                    style={ StyleSheet.absoluteFillObject }
                />
                {
                    state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;
                        const iconNode = options?.tabBarIcon?.({
                            focused: isFocused,
                            color: options.tabBarActiveTintColor ?? "",
                            size: 26
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

                        return (
                            <TabBarIcon
                                key={ route.key }
                                isFocused={ isFocused }
                                title={ options.title ?? "??" }
                                activeIcon={ icons?.active }
                                inactiveIcon={ icons?.inactive }
                                iconSize={ 26 }
                                activeColor={ COLORS.white }
                                inactiveColor={ COLORS.white2 }
                                onPress={ onPress }
                                onLongPress={ () => navigation.emit({ type: "tabLongPress", target: route.key }) }
                            />
                        );
                    })
                }
            </View>
        </>
    );
}

const useStyles = (width: number, bottom: number, compact: boolean, insetBottom: number) => StyleSheet.create({
    container: {
        position: "absolute",
        left: (useWindowDimensions().width - width) / 2,
        bottom,
        zIndex: 1,
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",
        height: SIMPLE_TABBAR_HEIGHT + (compact ? insetBottom : 0),
        paddingBottom: compact ? insetBottom : 0,
        gap: SEPARATOR_SIZES.lightSmall,
        width,
        overflow: "hidden",
        borderTopLeftRadius: compact ? 0 : 24,
        borderTopRightRadius: compact ? 0 : 24,
        borderBottomLeftRadius: compact ? 0 : 24,
        borderBottomRightRadius: compact ? 0 : 24,
        borderWidth: compact ? 0 : 1,
        borderColor: COLORS.gray4,
        backgroundColor: "transparent"
    }
});

export default TabBar;
