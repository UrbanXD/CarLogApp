import { Tabs } from 'expo-router';
import React from "react";
import { ICON_NAMES } from "../../features/Shared/constants/constants";
import TabBar from "../../features/Shared/components/tabBar/TabBar";

const TabLayout: React.FC = () => {
    return (
        <Tabs
            tabBar={ (props) => <TabBar { ...props } /> }
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Főoldal",
                    tabBarIcon: () =>
                        JSON.stringify({
                            "inactive": ICON_NAMES.homeOutline,
                            "active": ICON_NAMES.home
                        })
                }}
            />
            <Tabs.Screen
                name="workbook"
                options={{
                    title: "Munkakönyv",
                    tabBarIcon: () =>
                        JSON.stringify({
                            "inactive": ICON_NAMES.notebookOutline,
                            "active": ICON_NAMES.notebook
                        })
                }}
            />
            <Tabs.Screen
                name="service_log"
                options={{
                    title: "Szervízkönyv",
                    tabBarIcon: () =>
                        JSON.stringify({
                            "inactive": ICON_NAMES.serviceOutline,
                            "active": ICON_NAMES.service
                        })
                }}
            />
            <Tabs.Screen
                name="expenses"
                options={{
                    title: "Pénzügyek",
                    tabBarIcon: () =>
                        JSON.stringify({
                            "inactive": ICON_NAMES.expensesOutline,
                            "active": ICON_NAMES.expenses
                        })
                }}
            />
        </Tabs>
    );
}

export default TabLayout;