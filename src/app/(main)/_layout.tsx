import { Tabs } from "expo-router";
import React from "react";
import { ICON_NAMES } from "../../constants/index.ts";
import TabBar from "../../components/Navigation/TabBar/TabBar";
import { useTranslation } from "react-i18next";

const TabLayout: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Tabs
            tabBar={ (props) => <TabBar { ...props } /> }
            screenOptions={ {
                headerShown: false,
                animation: "shift",
                sceneStyle: { backgroundColor: "transparent" }
            } }
        >
            <Tabs.Screen
                name="index"
                options={ {
                    title: t("common.main_screen"),
                    tabBarIcon: () =>
                        JSON.stringify({
                            "inactive": ICON_NAMES.homeOutline,
                            "active": ICON_NAMES.home
                        })
                } }
            />
            <Tabs.Screen
                name="workbook"
                options={ {
                    title: t("rides.title"),
                    tabBarIcon: () =>
                        JSON.stringify({
                            "inactive": ICON_NAMES.notebookOutline,
                            "active": ICON_NAMES.notebook
                        })
                } }
            />
            <Tabs.Screen
                name="service_log"
                options={ {
                    title: t("service.title"),
                    tabBarIcon: () =>
                        JSON.stringify({
                            "inactive": ICON_NAMES.serviceOutline,
                            "active": ICON_NAMES.service
                        })
                } }
            />
            <Tabs.Screen
                name="expenses"
                options={ {
                    title: t("expenses.title"),
                    tabBarIcon: () =>
                        JSON.stringify({
                            "inactive": ICON_NAMES.expensesOutline,
                            "active": ICON_NAMES.expenses
                        })
                } }
            />
            <Tabs.Screen
                name="statistics"
                options={ {
                    title: t("statistics.title"),
                    tabBarIcon: () =>
                        JSON.stringify({
                            "inactive": ICON_NAMES.statistics,
                            "active": ICON_NAMES.statistics
                        })
                } }
            />
        </Tabs>
    );
};

export default TabLayout;