import React, {useEffect, useState} from "react";
import {Redirect} from "expo-router";
import {useDatabase} from "../features/core/utils/database/Database";
import {Session} from "@supabase/supabase-js";
import Auth from "../features/core/screens/Auth";

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
            ?   <Auth />
            :   <Redirect href="/(main)" />
    )
}

export default App;