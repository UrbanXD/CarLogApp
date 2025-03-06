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
import { SessionProvider } from "../features/Auth/context/SessionProvider.tsx";
import { ScreenScrollViewProvider } from "../features/ScreenScrollView/context/ScreenScrollViewProvider.tsx";

const Layout:React.FC = () => {
    const database = useDatabase();

    useEffect(() => {
        database.init();
    }, []);

    return (
        <Stack
            screenOptions={{
                header: () => <></>,
                animation: "slide_from_right",
                statusBarAnimation: "slide"
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    header: () => <StatusBar translucent={ true } />,
                }}
            />
            <Stack.Screen
                name="backToRootIndex"
            />
            <Stack.Screen
                name="(main)"
                options={{
                    header: () => <MainHeader />
                }}
            />
            <Stack.Screen
                name="(profile)/user"
                options={{
                    header: () => <SecondaryHeader title="Profil" />
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

const RootLayout: React.FC = () =>
    <DatabaseProvider>
        <Compactor components={[
            { Component: Provider, props: { store } },
            { Component: SafeAreaProvider },
            { Component: KeyboardProvider },
            { Component: ScreenScrollViewProvider },
            { Component: PortalProvider },
            { Component: GestureHandlerRootView, props: { style: { flex: 1 } } },
            { Component: SessionProvider },
            { Component: AlertProvider },
            { Component: BottomSheetModalProvider },
            { Component: BottomSheetProvider },
        ]}>
            <Layout />
        </Compactor>
    </DatabaseProvider>

export default RootLayout;