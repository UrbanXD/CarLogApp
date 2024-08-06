import React, {useEffect, useState} from "react";
import { PaperProvider, Text } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { theme } from "../styles/theme";
import HomeScreen from "../screens/HomeScreen";
import FirstScreen from "../screens/FirstScreen";
import {Session} from "@supabase/supabase-js";
import {useDatabase} from "../db/Database";
import {Alert, SafeAreaView, ScrollView, StatusBar, View} from "react-native";

export default function App() {
    const { supabaseConnector } = useDatabase();
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabaseConnector.client.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabaseConnector.client.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
        <Provider store={ store }>
            <PaperProvider theme={ theme }>
                {
                    session && session.user
                        ?   <Text
                                style={{ paddingTop: 100, color: "black", fontSize: 40}}
                                onPress={ async () => {
                                    try {
                                        await supabaseConnector.client.auth.signOut();
                                    } catch (e: any){
                                        Alert.alert(e.message)
                                    }
                                }}
                            >
                                Kijelentkezes
                            </Text>
                        :   <>
                                <StatusBar barStyle={ "dark-content" } />
                                    {/*<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>*/}
                                        <FirstScreen />
                                    {/*</ScrollView>*/}
                            </>
                }
            </PaperProvider>
        </Provider>
    );
}
