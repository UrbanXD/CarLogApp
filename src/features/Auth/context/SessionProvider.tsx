import { Session, User } from "@supabase/supabase-js";
import React, { Context, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useDatabase } from "../../Database/connector/Database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../../../constants/constants";

interface SessionProviderValue {
    session: Session | null
    notVerifiedUser: User | null
    setNotVerifiedUser: (value: User | null) => void
    refreshSession: () => Promise<void>
}

const SessionContext = createContext<SessionProviderValue | null>(null);

interface SessionProviderProps {
    children: ReactNode | null
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const { supabaseConnector} = useDatabase();

    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabaseConnector
            .client
            .auth
            .getSession()
            .then(
                ({ data: { session } }) => setSession(session)
            );

        supabaseConnector
            .client
            .auth
            .onAuthStateChange(
                (_event, session) => setSession(session)
            );

        AsyncStorage
            .getItem(LOCAL_STORAGE_KEYS.notConfirmedUser)
            .then(
                (value) => {
                    if(!value) return;

                    setNotVerifiedUser(JSON.parse(value) as User);
                }
            );
    }, []);

    useEffect(() => {
        supabaseConnector
            .client
            .auth
            .getUser()
            .then(
                ({ data: { user } }) => {
                    if(user) setNotVerifiedUser(null);
                }
            );

        if(session) AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.notConfirmedUser);
    }, [session]);

    const refreshSession = async () => {
        const { error } =
            await supabaseConnector
                .client
                .auth
                .refreshSession();

        if(error) console.error("refreshError", error);
    }

    return (
        <SessionContext.Provider
            value={{
                session,
                notVerifiedUser,
                setNotVerifiedUser,
                refreshSession
            }}
        >
            { children }
        </SessionContext.Provider>
    )
}

export const useSession = () => useContext<SessionProviderValue>(SessionContext as Context<SessionProviderValue>);