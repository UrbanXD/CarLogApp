import React, { ProviderProps, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./AuthContext.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import { useDatabase } from "../database/DatabaseContext.ts";
import { AuthError, GenerateLinkParams, Session, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AVATAR_COLOR, BaseConfig } from "../../constants/index.ts";
import { loadUser } from "../../features/user/model/actions/loadUser.ts";
import { router } from "expo-router";
import { DeleteUserToast, SignInToast, SignOutToast, SignUpToast } from "../../features/user/presets/toast/index.ts";
import { getToastMessage } from "../../ui/alert/utils/getToastMessage.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { SignInRequest } from "../../features/user/schemas/form/signInRequest.ts";
import { SignUpRequest } from "../../features/user/schemas/form/signUpRequest.ts";
import { OtpVerificationHandlerType } from "../../app/bottomSheet/otpVerification.tsx";
import { loadCars } from "../../features/car/model/actions/loadCars.ts";
import { resetCars } from "../../features/car/model/slice/index.ts";
import { resetUser } from "../../features/user/model/slice/index.ts";
import { getUserLocalCurrency } from "../../features/_shared/currency/utils/getUserLocalCurrency.ts";
import { useTranslation } from "react-i18next";

export const AuthProvider: React.FC<ProviderProps<unknown>> = ({
    children
}) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const database = useDatabase();
    const { supabaseConnector, powersync, userDao, carDAO } = database;

    const [session, setSession] = useState<Session | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);

    const sessionDataFetched = useRef<boolean>(false);

    useEffect(() => {
        supabaseConnector.client.auth.getSession().then(({ data }) => {
            setAuthenticated(!!data.session);
            setSession(data.session);
        });

        const { data: authListener } = supabaseConnector.client.auth.onAuthStateChange(
            (_event, supabaseSession) => {
                if(!supabaseSession) {
                    if(router.canDismiss()) router.dismissAll();
                    router.replace("/backToRootIndex");
                }

                setAuthenticated(!!supabaseSession);
                setSession(supabaseSession);
            }
        );

        return () => authListener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        database.init();

        if(!session) {
            dispatch(resetUser());
            dispatch(resetCars());
            sessionDataFetched.current = false;
        }

        if(session?.user.id === notVerifiedUser?.id) setNotVerifiedUser(null);

        if(powersync.currentStatus.connected && powersync.currentStatus.hasSynced && session) {
            dispatch(loadUser({ database, userId: session.user.id }));
            dispatch(loadCars(database));
        }

        return powersync.registerListener({
            statusChanged: (status) => {
                if(status.connected && status.hasSynced && !status.dataFlowStatus.downloading && session && !sessionDataFetched.current) {
                    dispatch(loadUser({ database, userId: session.user.id }));
                    dispatch(loadCars(database));
                    sessionDataFetched.current = true;
                }
            }
        });
    }, [session]);

    const openAccountVerification = (email: string) => {
        router.push({
            pathname: "bottomSheet/otpVerification",
            params: {
                type: "signup",
                title: t("auth.email_verification"),
                email,
                handlerType: OtpVerificationHandlerType.SignUp
            }
        });
    };

    const signUp = async (request: SignUpRequest): Promise<ApiResult> => {
        try {
            const {
                data: emailExists,
                error: emailError
            } = await supabaseConnector.client.rpc("email_exists", { email_address: request.email });

            if(emailError) throw emailError;
            if(emailExists) throw { code: "email_exists" } as AuthError;

            const avatarColor = AVATAR_COLOR[Math.floor(Math.random() * AVATAR_COLOR.length)];
            const { data: { user: supabaseUser }, error } = await supabaseConnector.client.auth.signUp({
                email: request.email,
                password: request.password,
                options: {
                    data: { firstname: request.firstname, lastname: request.lastname, avatar_color: avatarColor }
                }
            });

            if(error) throw error;
            if(!supabaseUser) throw { code: "user_not_found" } as AuthError;

            updateNotVerifiedUser(supabaseUser).catch(console.error);

            openAccountVerification(supabaseUser.email);
            await userDao.create({
                id: supabaseUser.id,
                email: supabaseUser.email,
                firstname: supabaseUser.user_metadata.firstname,
                lastname: supabaseUser.user_metadata.lastname,
                currency_id: getUserLocalCurrency(),
                avatar_url: null,
                avatar_color: supabaseUser.user_metadata.avatar_color
            });
        } catch(error) {
            console.error("Signup error: ", error);
            const toastMessage = getToastMessage({ messages: SignUpToast, error });
            openToast(toastMessage);
        }
    };

    const signIn = async (request: SignInRequest) => {
        const { error } = await supabaseConnector.client.auth.signInWithPassword({
            email: request.email,
            password: request.password
        });

        if(!error) {
            router.dismissTo("/backToRootIndex");
            openToast(SignInToast.success());
            return;
        }

        if(error.code === "email_not_confirmed") return openAccountVerification(request.email);

        console.log("signIn error:", error);
        const toastMessage = getToastMessage({ messages: SignInToast, error });
        openToast(toastMessage);
    };

    const signOut = async (disabledToast: boolean = false) => {
        try {
            const { error } = await supabaseConnector.client.auth.signOut();

            if(error) throw error;

            if(!disabledToast) openToast(SignOutToast.success());
            await database.disconnect();
        } catch(error) {
            if(disabledToast || !(error instanceof AuthError)) return; // if not auth error just skip
            openToast(getToastMessage({ messages: SignOutToast, error }));
        }
    };

    const deleteAccount = async () => {
        try {
            if(!session?.user) throw { code: "session_not_found" };

            const emailParams: GenerateLinkParams = { type: "magiclink", email: session.user.email };

            const { error } = await supabaseConnector.client.functions.invoke(
                "generate-email",
                {
                    method: "POST",
                    body: JSON.stringify(emailParams)
                }
            );

            if(error) throw error;

            router.push({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "magiclink", // magiclink viselkedik ugy mint ha torlest verifyolna *mivel supabasebe nincs implementalva ez meg*
                    title: t("auth.delete_account"),
                    email: emailParams.email,
                    userId: session?.user.id,
                    handlerType: OtpVerificationHandlerType.UserDelete
                }
            });
        } catch(error) {
            console.log(error);
            openToast(getToastMessage({ messages: DeleteUserToast, error }));
        }
    };

    const fetchNotVerifiedUser = async () => {
        const newNotVerifiedUser = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER);
        if(!newNotVerifiedUser) return;

        setNotVerifiedUser(JSON.parse(newNotVerifiedUser));
    };

    const updateNotVerifiedUser = async (newNotVerifiedUser: User | null) => {
        setNotVerifiedUser(newNotVerifiedUser);

        if(newNotVerifiedUser) {
            await AsyncStorage.setItem(
                BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER,
                JSON.stringify(newNotVerifiedUser)
            );
        } else {
            await AsyncStorage.removeItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER);
        }
    };

    const refreshSession = async () => {
        const { error } = await supabaseConnector.client.auth.refreshSession();

        if(error) console.log("refreshError", error);
    };

    const value = useMemo(
        () => {
            const hasPassword = !!session?.user.user_metadata?.has_password;
            const providers: Array<string> =
                session?.user.user_metadata?.providers ??
                (session?.user.user_metadata?.provider ? [session.user.user_metadata.provider] : []);

            return {
                authenticated,
                hasPassword,
                providers,
                openAccountVerification,
                signUp,
                signIn,
                signOut,
                deleteAccount,
                refreshSession,
                notVerifiedUser,
                updateNotVerifiedUser
            };
        },
        [
            session,
            authenticated,
            openAccountVerification,
            signUp,
            signIn,
            signOut,
            deleteAccount,
            refreshSession,
            notVerifiedUser,
            updateNotVerifiedUser
        ]
    );

    return (
        <AuthContext.Provider value={ value }>
            { children }
        </AuthContext.Provider>
    );
};