import {Session} from "@supabase/supabase-js";
import React, {Context, createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useDatabase} from "../../Database/connector/Database";

interface AuthProviderValue {
    session: Session | null
}

const AuthContext = createContext<AuthProviderValue | null>(null);

interface AuthProviderProps {
    children: ReactNode | null
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { supabaseConnector } = useDatabase();

    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabaseConnector
            .client
            .auth
            .getSession()
            .then(
                ({ data: { session } }) =>
                    setSession(session)
            );

        supabaseConnector
            .client
            .auth
            .onAuthStateChange(
                (_event, session) =>
                    setSession(session)
            );
    }, []);

    return (
        <AuthContext.Provider
            value={{
                session
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext<AuthProviderValue>(AuthContext as Context<AuthProviderValue>);