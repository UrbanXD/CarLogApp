import {Tabs, withLayoutContext} from 'expo-router';
import React from "react";
import {Provider} from "react-redux";
import {store} from "../../redux/store";
import {theme} from "../../constants/theme";
import {PaperProvider} from "react-native-paper";
import {ICON_COLORS, ICON_NAMES} from "../../constants/constants";
import TabBar from "../../components/tabBar/TabBar";
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions
} from "@react-navigation/material-top-tabs";
import {ParamListBase, TabNavigationState} from "@react-navigation/native";
import CarHeader from "../../reactNodes/layouts/header/CarHeader";
import Header from "../../components/Header/Header";

const TabLayout:React.FC = () => {
    return (
        <Tabs
            tabBar={
                (props) =>
                    <TabBar { ...props } />
            }
            screenOptions={{
                header: () => <CarHeader />,
                // headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Főoldal",
                    tabBarIcon: () => JSON.stringify({
                        "inactive": ICON_NAMES.homeOutline,
                        "active": ICON_NAMES.home
                    })
                }}
            />
            <Tabs.Screen
                name="workbook"
                options={{
                    title: "Munkakönyv",
                    tabBarIcon: () => JSON.stringify({
                        "inactive": ICON_NAMES.notebookOutline,
                        "active": ICON_NAMES.notebook
                    })
                }}
            />
            <Tabs.Screen
                name="service_log"
                options={{
                    title: "Szervízkönyv",
                    tabBarIcon: () => JSON.stringify({
                        "inactive": ICON_NAMES.serviceOutline,
                        "active": ICON_NAMES.service
                    })
                }}
            />
            <Tabs.Screen
                name="expenses"
                options={{
                    title: "Pénzügyek",
                    tabBarIcon: () => JSON.stringify({
                        "inactive": ICON_NAMES.expensesOutline,
                        "active": ICON_NAMES.expenses
                    })
                }}
            />
        </Tabs>
    );
}
export default TabLayout;