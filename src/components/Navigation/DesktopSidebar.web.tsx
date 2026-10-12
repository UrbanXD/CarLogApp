import React from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { router, usePathname } from "expo-router";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import { COLORS, ICON_NAMES } from "../../constants";
import SidebarCarPicker from "../../features/car/components/carPicker/SidebarCarPicker.web";
import Avatar from "../Avatar/Avatar";
import { useUser } from "../../features/user/hooks/useUser";
import { getLabelByName } from "../../utils/getLabelByName";

const NAV_ITEMS = [
    { route: "/", title: "common.main_screen", icon: ICON_NAMES.homeOutline, activeIcon: ICON_NAMES.home },
    { route: "/workbook", title: "rides.title", icon: ICON_NAMES.notebookOutline, activeIcon: ICON_NAMES.notebook },
    { route: "/service_log", title: "service.title", icon: ICON_NAMES.serviceOutline, activeIcon: ICON_NAMES.service },
    { route: "/expenses", title: "expenses.title", icon: ICON_NAMES.expensesOutline, activeIcon: ICON_NAMES.expenses },
    { route: "/statistics", title: "statistics.title", icon: ICON_NAMES.statistics, activeIcon: ICON_NAMES.statistics }
] as const;

export default function DesktopSidebar() {
    const { width } = useWindowDimensions();
    const pathname = usePathname();
    const { t } = useTranslation();
    const { user } = useUser();

    if(width < 1040 || pathname.startsWith("/auth")) return null;

    const activeRoute = pathname.startsWith("/ride") || pathname.startsWith("/odometer")
                        ? "/workbook"
                        : pathname.startsWith("/expense")
                          ? "/expenses"
                          : pathname.startsWith("/service")
                            ? "/service_log"
                            : pathname.startsWith("/car")
                              ? "/"
                              : NAV_ITEMS.find(({ route }) => route === "/" ? pathname === "/" : pathname.startsWith(
                        route))?.route;

    return (
        <View style={ styles.sidebar }>
            <Pressable
                accessibilityRole="link"
                accessibilityLabel={ t("common.main_screen") }
                onPress={ () => router.navigate("/" as never) }
                style={ styles.brand }
            >
                <View style={ styles.brandMark }><Icon icon={ ICON_NAMES.car } size={ 23 }
                                                       color={ COLORS.black }/></View>
                <Text style={ styles.brandText }>CARLOG</Text>
            </Pressable>
            <SidebarCarPicker/>
            <Text style={ styles.sectionLabel }>{ t("navigation.menu") }</Text>
            <View style={ styles.nav }>
                { NAV_ITEMS.map((item) => {
                    const active = activeRoute === item.route;

                    return (
                        <Pressable
                            key={ item.route }
                            onPress={ () => router.navigate(item.route as never) }
                            style={ [styles.navItem, active && styles.navItemActive] }
                        >
                            { active && <View style={ styles.activeMark }/> }
                            <Icon
                                icon={ active ? item.activeIcon : item.icon }
                                size={ 21 }
                                color={ active ? COLORS.fuelYellow : COLORS.gray1 }
                            />
                            <Text style={ [styles.navText, active && styles.navTextActive] }>{ t(item.title) }</Text>
                        </Pressable>
                    );
                }) }
            </View>
            <Pressable style={ styles.footer } onPress={ () => router.push("/user") }>
                { user?.avatarPath
                  ? <Avatar.Image path={ user.avatarPath } avatarSize={ 42 }/>
                  : <Avatar.Text
                      label={ getLabelByName(`${ user?.firstname ?? "" } ${ user?.lastname ?? "" }`) || "?" }
                      avatarSize={ 42 }
                      backgroundColor={ user?.avatarColor }
                  /> }
                <View style={ styles.profileText }>
                    <Text style={ styles.profileName } numberOfLines={ 1 }>
                        { user ? `${ user.firstname } ${ user.lastname }`.trim() : t("profile.title") }
                    </Text>
                    <Text style={ styles.profileCaption }>{ t("profile.title") }</Text>
                </View>
                <Icon icon={ ICON_NAMES.rightArrowHead } size={ 19 } color={ COLORS.gray2 }/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 20,
        width: 240,
        paddingHorizontal: 18,
        paddingTop: 28,
        paddingBottom: 10,
        backgroundColor: "#151617",
        borderRightWidth: 1,
        borderRightColor: "#2A2B2D"
    },
    brand: {
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        marginBottom: 44,
        paddingHorizontal: 10
    },
    brandMark: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.fuelYellow
    },
    brandText: {
        color: COLORS.white,
        fontFamily: "Gilroy-Heavy",
        fontSize: 20,
        letterSpacing: 1.2
    },
    sectionLabel: {
        marginBottom: 12,
        paddingHorizontal: 12,
        color: COLORS.gray2,
        fontFamily: "Gilroy-Heavy",
        fontSize: 12.5,
        letterSpacing: 1.5
    },
    nav: { gap: 5 },
    navItem: {
        position: "relative",
        minHeight: 46,
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
        paddingHorizontal: 13,
        borderRadius: 12
    },
    navItemActive: { backgroundColor: "#29291D" },
    activeMark: {
        position: "absolute",
        left: 0,
        top: 10,
        bottom: 10,
        width: 3,
        borderRadius: 2,
        backgroundColor: COLORS.fuelYellow
    },
    navText: {
        color: "#B3B3B3",
        fontFamily: "Gilroy-Medium",
        fontSize: 17.5
    },
    navTextActive: { color: COLORS.fuelYellow, fontFamily: "Gilroy-Heavy" },
    footer: {
        marginTop: "auto",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        minHeight: 68,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#2A2B2D"
    },
    profileText: { flex: 1, minWidth: 0, gap: 3 },
    profileName: { color: COLORS.white, fontFamily: "Gilroy-Heavy", fontSize: 18.75 },
    profileCaption: { color: COLORS.gray2, fontFamily: "Gilroy-Medium", fontSize: 15.625 }
});
