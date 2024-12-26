import { Stack } from 'expo-router/stack';
import React, {useEffect, useState} from "react";
import '@azure/core-asynciterator-polyfill';
import {ScrollViewProvider} from "../features/core/context/ScrollViewProvider";
import {useDatabase} from "../features/core/utils/database/Database";
import { Session } from '@supabase/supabase-js';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {store} from "../features/core/redux/store";
import {theme} from "../features/core/constants/theme";
import {Provider} from "react-redux";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {StatusBar} from "expo-status-bar";
import Header from "../features/core/components/header/Header";
import {BottomSheetProvider} from "../features/core/context/BottomSheetProvider";
import { DatabaseProvider } from '../features/core/context/DatabaseProvider';
import Portal, {PortalHost, PortalProvider} from "@gorhom/portal";
import {View} from "react-native";
import {SEPARATOR_SIZES} from "../features/core/constants/constants";
import Compactor from "../features/core/components/shared/Compactor";
import {AlertProvider} from "../features/core/context/AlertProvider";

const Layout:React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);

    const database = useDatabase();
    const { supabaseConnector } = useDatabase();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        database.init();
    }, []);

    useEffect(() => {
        const { data } =
            supabaseConnector
                .client
                .auth
                .onAuthStateChange(async (event, session) => {
                    // console.log('supabase.auth.onAuthStateChange', event);
                    setSession(session);
                    setInitialized(true);
                });

        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    return (
        <Compactor components={[
            { Component: AlertProvider },
            { Component: Provider, props: { store } },
            { Component: SafeAreaProvider },
            { Component: KeyboardProvider },
            { Component: GestureHandlerRootView, props: { style: {flex: 1} } },
            { Component: PortalProvider },
            { Component: BottomSheetModalProvider }, // Ez előbb legyen
            { Component: BottomSheetProvider }, // Ez utána
            { Component: ScrollViewProvider },
        ]}>
            <Stack screenOptions={{ header: () => <></>}} >
                <Stack.Screen
                    name="index"
                    options={{
                        header: () => <StatusBar translucent={ true } />
                    }}
                />
                <Stack.Screen
                    name="(main)"
                    options={{
                        header: () => <Header />
                    }}
                />
            </Stack>
        </Compactor>
    );
}

const RootLayout: React.FC = () => {
    return (
        <DatabaseProvider>
            <Layout />
        </DatabaseProvider>
    )
}
export default RootLayout;