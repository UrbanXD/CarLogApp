import { Stack } from 'expo-router/stack';
import {useRootNavigationState} from 'expo-router';
import React, {useEffect, useState} from "react";
import '@azure/core-asynciterator-polyfill';
import {ScrollViewProvider} from "../providers/ScrollViewProvider";
import {DatabaseProvider} from "../providers/DatabaseProvider";
import {useDatabase} from "../db/Database";
import { Session } from '@supabase/supabase-js';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";

const Layout:React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);

    const database = useDatabase();
    const { supabaseConnector } = useDatabase();

    useEffect(() => {
        database.init();
    }, []);

    useEffect(() => {
        const { data } = supabaseConnector.client.auth.onAuthStateChange(async (event, session) => {
            console.log('supabase.auth.onAuthStateChange', event);
            setSession(session);
            setInitialized(true);
        });
        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollViewProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="fuelMonitor" />
                        <Stack.Screen name="index" />
                    </Stack>
                </ScrollViewProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

const RootLayout: React.FC = () => {
    return (
        <DatabaseProvider>
            <Layout></Layout>
        </DatabaseProvider>
    )
}
export default RootLayout;