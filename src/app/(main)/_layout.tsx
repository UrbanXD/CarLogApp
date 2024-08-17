import {Tabs, withLayoutContext} from 'expo-router';
import React from "react";
import {Provider} from "react-redux";
import {store} from "../../redux/store";
import {theme} from "../../constants/theme";
import {PaperProvider} from "react-native-paper";
import { ICON_NAMES} from "../../constants/constants";
import TabBar from "../../components/tabBar/TabBar";
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions
} from "@react-navigation/material-top-tabs";
import {ParamListBase, TabNavigationState} from "@react-navigation/native";
import HomeHeader from "../../layouts/header/HomeHeader";

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTop =
    withLayoutContext<
        MaterialTopTabNavigationOptions & { excludeScreens?: string[] },
        typeof Navigator,
        TabNavigationState<ParamListBase>,
        MaterialTopTabNavigationEventMap
    >(Navigator);

const TabLayout:React.FC = () => {
    return (
        <Provider store={ store }>
            <PaperProvider theme={ theme }>
                <Tabs
                    tabBar={
                        (props) =>
                            <TabBar { ...props } />
                    }
                    screenOptions={{
                        header: () => <HomeHeader></HomeHeader>
                        // headerShown: false,
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: "Főoldal",
                        }}
                    />
                    <Tabs.Screen
                        name="workbook"
                        options={{
                            title: "Munkakönyv",
                            tabBarIcon: () => ICON_NAMES.notebook
                        }}
                    />
                    <Tabs.Screen
                        name="service_log"
                        options={{
                            title: "Szervízkönyv",
                            tabBarIcon: () => ICON_NAMES.service
                        }}
                    />
                    <Tabs.Screen
                        name="expenses"
                        options={{
                            title: "Pénzügyek",
                            tabBarIcon: () => ICON_NAMES.expenses
                        }}
                    />
                </Tabs>
                {/*<MaterialTop*/}
                {/*    tabBar={ (props) => <TabBar { ...props }  /> }*/}
                {/*    screenOptions={{*/}
                {/*        swipeEnabled: false*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <MaterialTop.Screen*/}
                {/*        name="index"*/}
                {/*        options={{*/}
                {/*            title: "Főoldal",*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    <MaterialTop.Screen*/}
                {/*        name="workbook"*/}
                {/*        options={{*/}
                {/*            title: "Munkakönyv",*/}
                {/*            tabBarIcon: () => ICON_NAMES.notebook*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    <MaterialTop.Screen*/}
                {/*        name="service_log"*/}
                {/*        options={{*/}
                {/*            title: "Szervízkönyv",*/}
                {/*            tabBarIcon: () => ICON_NAMES.service*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    <MaterialTop.Screen*/}
                {/*        name="expenses"*/}
                {/*        options={{*/}
                {/*            title: "Pénzügyek",*/}
                {/*            tabBarIcon: () => ICON_NAMES.expenses*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</MaterialTop>*/}
            </PaperProvider>
        </Provider>
    );
}
export default TabLayout;