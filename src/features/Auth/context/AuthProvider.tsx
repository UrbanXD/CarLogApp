import { AuthApiError, Session, User } from "@supabase/supabase-js";
import React, { Context, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useDatabase } from "../../Database/connector/Database";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../../../constants/constants";
import { useAlert } from "../../Alert/context/AlertProvider";
import signOutToast from "../../Alert/layouts/toast/signOutToast";
import signUpToast from "../../Alert/layouts/toast/signUpToast";
import { SignUpFormFieldType } from "../../Form/constants/schemas/signUpSchema.tsx";
import { SignInFormFieldType } from "../../Form/constants/schemas/signInSchema.tsx";
import signInToast from "../../Alert/layouts/toast/signInToast.ts";

type SignUpFunction = (
    user: SignUpFormFieldType,
    forceCloseBottomSheet: () => void
) => Promise<void>

type SignInFunction = (
    user: SignInFormFieldType,
    forceCloseBottomSheet: () => void
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

        const handleNotVerifiedUser = async () => {
            const userString = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.notConfirmedUser);

            if(!userString) return;

            setUser(JSON.parse(userString) as User);
        }

        handleNotVerifiedUser();
    }, []);

    useEffect(() => {
        console.log("session: ", session, " :session");
        supabaseConnector
            .client
            .auth
            .getUser()
            .then(
                ({ data: { user } }) => {
                    if(user) setUser(user);
                }
            );

        if(session) AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.notConfirmedUser);
    }, [session]);

    const signUp: SignUpFunction = async (
        user,
        forceCloseBottomSheet
    ) => {
        try {
            const {
                email,
                password,
                firstname,
                lastname
            } = user;

            // mivel van email hitelesites, igy a supabase nem dob hibat, ha mar letezo emaillel regisztral
            const {
                data: emailExists,
                error: emailError
            } =
                await supabaseConnector
                    .client
                    .rpc(
                        "email_exists",
                        { email_address: email }
                    );

            if(emailError) throw emailError;
            if(emailExists) throw { code: "email_exists" } as AuthApiError;


            const { data: { user: newUser }, error } =
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

            setUser(newUser);
            await AsyncStorage.setItem(
                LOCAL_STORAGE_KEYS.notConfirmedUser,
                JSON.stringify(newUser)
            );

            await forceCloseBottomSheet();

            router.push({
                pathname: "/verify",
                params: {
                    type: "signup",
                    title: "Email cím hitelesítés",
                    email: email,
                    toastMessages: JSON.stringify(signUpToast),
                    replaceHREF: "/(main)"
                }
            });
        } catch (error) {
            let toast = signUpToast[error.code];
            if(!toast) toast = signUpToast.error;

            addToast(toast);
        }
    }

    const signIn: SignInFunction = async (
        user,
        forceCloseBottomSheet
    ) => {
        try {
            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .signInWithPassword(user);

            if (error) throw error;

            forceCloseBottomSheet();
        } catch (error) {
            if(error.code) {
                if(error.code === "email_not_confirmed") {
                    router.push({
                        pathname: "/verify",
                        params: {
                            type: "signup",
                            title: "Email cím hitelesítés",
                            email: user.email,
                            toastMessages: JSON.stringify(signInToast),
                            replaceHREF: "/(main)"
                        }
                    });

                    return;
                }

                const toastMessage = signInToast[error.code];
                if(toastMessage) return addToast(toastMessage);

                return addToast(signInToast.error);
            }

            console.error("hiba input useSignIn auth api")
            addToast(signInToast.error);
        }
    }

    const signOut = async () => {
        try {
            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .signOut();

            if(error) return addToast(signOutToast.error);

            await powersync.disconnectAndClear();
            router.replace("/backToRootIndex");
            addToast(signOutToast.success);
        } catch (e) {
            addToast(signOutToast.error);
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