import React, {useEffect, useState} from "react";
import { PaperProvider, Text } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { theme } from "../styles/theme";
import HomeScreen from "../screens/HomeScreen";
import FirstScreen from "../screens/FirstScreen";
import {Session} from "@supabase/supabase-js";
import {useDatabase} from "../db/Database";
import {Alert, StatusBar} from "react-native";

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
                <StatusBar barStyle={"dark-content"} />
                {
                    session && session.user
                        ?   <HomeScreen />
                        :   <FirstScreen />
                }
            </PaperProvider>
        </Provider>
    );
}
