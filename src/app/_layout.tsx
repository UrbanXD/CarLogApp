import { Stack } from 'expo-router/stack';
import React, {useEffect, useState} from "react";
import '@azure/core-asynciterator-polyfill';
import {ScrollViewProvider} from "../features/core/context/ScrollViewProvider";
import {DatabaseProvider} from "../features/form/context/DatabaseProvider";
import {useDatabase} from "../features/core/utils/database/Database";
import { Session } from '@supabase/supabase-js';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {store} from "../features/core/redux/store";
import {theme} from "../features/core/constants/theme";
import {Provider} from "react-redux";
import {PaperProvider} from "react-native-paper";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {StatusBar} from "expo-status-bar";
import CarHeader from "../features/header/layouts/CarHeader";
import {BottomSheetProvider} from "../features/core/context/BottomSheetProvider";

const Layout:React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);

    const database = useDatabase();
    const { supabaseConnector } = useDatabase();

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
        <Provider store={ store }>
            <PaperProvider theme={ theme }>
                <SafeAreaProvider>
                    <KeyboardProvider>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <BottomSheetModalProvider>
                                <ScrollViewProvider>
                                    <BottomSheetProvider>
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
                                                    header: () => <CarHeader />
                                                }}
                                            />
                                        </Stack>
                                    </BottomSheetProvider>
                                </ScrollViewProvider>
                            </BottomSheetModalProvider>
                        </GestureHandlerRootView>
                    </KeyboardProvider>
                </SafeAreaProvider>
            </PaperProvider>
        </Provider>
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