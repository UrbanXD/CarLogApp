import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { SplashScreen } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { theme } from "../styles/theme";
import { useFonts } from "expo-font";
import HomeScreen from "../screens/HomeScreen";


export default function App() {
    return (
        <Provider store={ store }>
            <PaperProvider theme={ theme }>
                <StatusBar style="light" />
                <HomeScreen />
            </PaperProvider>
        </Provider>
    );
}
