import { Session, User } from "@supabase/supabase-js";
import React, { Context, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useDatabase } from "../../Database/connector/Database";
import { router } from "expo-router";
import registerToast from "../../Alert/layouts/toast/signUpToast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../../Shared/constants/constants";
import { useAlert } from "../../Alert/context/AlertProvider";
import logoutToast from "../../Alert/layouts/toast/signOutToast";

type SignUpFunction = (
    email: string,
    password: string,
    firstname: string,
    lastname: string
) => Promise<void>

type SignInFunction = (
    email: string,
    password: string
) => Promise<void>

interface AuthProviderValue {
    user: User | null
    session: Session | null
    signUp: SignUpFunction
    signIn: SignInFunction
    signOut: () => void
}

const AuthContext = createContext<AuthProviderValue | null>(null);

interface AuthProviderProps {
    children: ReactNode | null
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { supabaseConnector, powersync } = useDatabase();
    const { addToast } = useAlert();

    const [user, setUser] = useState<User | null>(null);
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

        if(!user) {
            AsyncStorage.getItem(LOCAL_STORAGE_KEYS.notConfirmedUser).then(
                (user) => setUser(user ? JSON.parse(user) : null)
            )
        }
    }, []);

    useEffect(() => {
        console.log("session: ", session, " :session");
        supabaseConnector
            .client
            .auth
            .getUser()
            .then(
                ({ data: { user } }) =>
                    setUser(user)
            );

        AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.notConfirmedUser);
    }, [session]);

    const signUp: SignUpFunction = async (
        email,
        password,
        firstname,
        lastname
    ) => {
        const { data: { user }, error } =
            await supabaseConnector
                .client
                .auth
                .signUp({
                    email,
                    password,
                    options: {
                        data: {
                            firstname,
                            lastname
                        }
                    }
                });

        if(error) throw error;

        setUser(user);
        await AsyncStorage.setItem(
            LOCAL_STORAGE_KEYS.notConfirmedUser,
            JSON.stringify(user)
        );

        router.push({
            pathname: "/verify",
            params: {
                type: "signup",
                title: "Email cím hitelesítés",
                email: email,
                toastMessages: JSON.stringify(registerToast),
                replaceHREF: "/(main)"
            }
        });
    }

    const signIn: SignInFunction = async (
        email,
        password
    ) => {
        const { error } =
            await supabaseConnector
                .client
                .auth
                .signInWithPassword({
                    email,
                    password
                });

        if (error) throw error;
    }

    const signOut = async () => {
        try {
            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .signOut();

            if(error) return addToast(logoutToast.error);

            await powersync.disconnectAndClear();
            router.replace("/backToRootIndex");
            addToast(logoutToast.success);
        } catch (e) {
            addToast(logoutToast.error);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                signUp,
                signIn,
                signOut
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext<AuthProviderValue>(AuthContext as Context<AuthProviderValue>);