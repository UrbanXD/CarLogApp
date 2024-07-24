import { Tabs, useRootNavigationState } from 'expo-router';
import React, {useRef, useState} from "react";
import {CompetitionProvider} from "../../providers/CompetitionProvider";
import {store} from "../../redux/store";
import {Provider} from "react-redux";
import {bottomTabColors, bottomTabStyles} from "../../styles/bottomTabs.style";
import {StatusBar} from "expo-status-bar";
import TabbarIcon from "../../components/tabbar/TabbarIcon";
import {theme} from "../../styles/theme";
import {Text} from "react-native";
import Tabbar from "../../components/tabbar/Tabbar";

const TabLayout: React.FC = () => {
    return (
        <Provider store={ store }>
            <CompetitionProvider>
                <StatusBar style="light" />
                <Tabs
                    tabBar={
                        (props) =>
                            <Tabbar
                                { ...props }
                                tabBarStyle={ bottomTabStyles.style }
                                tabBarActiveTintColor={ bottomTabColors.activeIcon }
                                tabBarInactiveTintColor={ bottomTabColors.inactiveIcon }
                            />
                    }
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            headerShown: false,
                            title: "Tabella",
                            tabBarIcon: () => "home"
                        }}
                    />
                    <Tabs.Screen
                        name="settings"
                        options={{
                            headerShown: false,
                            tabBarIcon: () => "cog"
                        }}
                    />
                </Tabs>
            </CompetitionProvider>
        </Provider>
    );
}

export default TabLayout;