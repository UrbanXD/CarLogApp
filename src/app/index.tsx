import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useDatabase } from "../features/core/utils/database/Database";
import { Session } from "@supabase/supabase-js";
import FirstScreen from "../features/layouts/screens/FirstScreen";

const App: React.FC = () => {
    const { supabaseConnector } = useDatabase();
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabaseConnector.client.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            console.log(session)
        })

        supabaseConnector.client.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, []);

    return (
        !(session && session.user)
            ?   <FirstScreen />
            :   <Redirect href="/(main)" />
    )
}

export default App;