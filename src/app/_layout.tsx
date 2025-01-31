import { Stack } from 'expo-router/stack';
import React, { useEffect } from "react";
import '@azure/core-asynciterator-polyfill';
import { useDatabase } from "../features/Database/connector/Database";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { store } from "../features/Database/redux/store";
import { Provider } from "react-redux";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import MainHeader from "../features/Navigation/components/Header/MainHeader";
import { BottomSheetProvider } from "../features/BottomSheet/context/BottomSheetProvider";
import { DatabaseProvider } from '../features/Database/context/DatabaseProvider';
import { PortalProvider } from "@gorhom/portal";
import Compactor from "../components/Compactor";
import { AlertProvider } from "../features/Alert/context/AlertProvider";
import SecondaryHeader from "../features/Navigation/components/Header/SecondaryHeader";
import { AuthProvider } from "../features/Auth/context/AuthProvider";

const Layout:React.FC = () => {
    const database = useDatabase();

    useEffect(() => {
        database.init();
    }, []);

    return (
            <Stack
                screenOptions={{
                    header: () => <></>
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        header: () => <StatusBar translucent={ true } />
                    }}
                />
                <Stack.Screen
                    name="backToRootIndex"
                />
                <Stack.Screen
                    name="verify"
                    options={{
                        header: () => <SecondaryHeader />
                    }}
                />
                <Stack.Screen
                    name="(main)"
                    options={{
                        header: () => <MainHeader />
                    }}
                />
                <Stack.Screen
                    name="(edit)/car"
                    options={{
                        header: () => <SecondaryHeader title="Autó Adatlap" />,
                    }}
                />
            </Stack>
    );
}

const RootLayout: React.FC = () => {
    return (
        <DatabaseProvider>
            <Compactor components={[
                { Component: AlertProvider },
                { Component: AuthProvider },
                { Component: Provider, props: { store } },
                { Component: GestureHandlerRootView, props: { style: { flex: 1 } } },
                { Component: BottomSheetModalProvider },
                { Component: BottomSheetProvider },
                { Component: SafeAreaProvider },
                { Component: KeyboardProvider },
                { Component: PortalProvider },
            ]}>
                <Layout />
            </Compactor>
        </DatabaseProvider>
    )
}

export default RootLayout;