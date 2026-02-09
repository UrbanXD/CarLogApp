import React, { ProviderProps, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext.ts";
import { useAppDispatch } from "../../hooks";
import { useDatabase } from "../database/DatabaseContext.ts";
import { AuthError, GenerateLinkParams, Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AVATAR_COLOR, BaseConfig } from "../../constants";
import { router } from "expo-router";
import { DeleteUserToast, SignInToast, SignOutToast, SignUpToast } from "../../features/user/presets/toast";
import { getToastMessage } from "../../ui/alert/utils/getToastMessage.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { SignInRequest } from "../../features/user/schemas/form/signInRequest.ts";
import { SignUpRequest } from "../../features/user/schemas/form/signUpRequest.ts";
import { resetSelectedCar } from "../../features/car/model/slice";
import { getUserLocalCurrency } from "../../features/_shared/currency/utils/getUserLocalCurrency.ts";
import { useTranslation } from "react-i18next";
import { OtpVerificationHandlerType } from "../../features/user/hooks/useOtpVerificationHandler.ts";
import { Directory } from "expo-file-system";
import { INPUT_IMAGE_TEMP_DIR } from "../../components/Input/imagePicker/InputImagePicker.tsx";
import { loadSelectedCar } from "../../features/car/model/actions/loadSelectedCar.ts";

export const AuthProvider: React.FC<ProviderProps<unknown>> = ({
    children
}) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const database = useDatabase();
    const { supabaseConnector, attachmentQueue } = database;

    const [session, setSession] = useState<Session | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [notVerifiedEmail, setNotVerifiedEmail] = useState<string | null>(null);

    useEffect(() => {
        const { data: authListener } = supabaseConnector.client.auth.onAuthStateChange(
            (event, supabaseSession) => {
                if(event === "PASSWORD_RECOVERY") return;

                if(!supabaseSession) {
                    database.disconnect();

                    if(router.canDismiss()) router.dismissAll();
                    router.replace("/backToRootIndex");
                } else {
                    database.init();
                }

                setAuthenticated(!!supabaseSession);
                setSession(supabaseSession);
            }
        );

        return () => authListener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if(session && notVerifiedEmail && session.user.email === notVerifiedEmail) updateNotVerifiedEmail(null);
        if(!session) {
            fetchNotVerifiedEmail();
            dispatch(resetSelectedCar());
        }

        if(!session?.user.id) return;

        dispatch(loadSelectedCar());

        const userId = session.user.id;

        if(attachmentQueue) attachmentQueue.cleanUpLocalFiles(userId);
        const inputImageTempDirectory = new Directory(INPUT_IMAGE_TEMP_DIR);
        if(inputImageTempDirectory.exists) inputImageTempDirectory.delete();
    }, [session?.user.id]);

    const openAccountVerification = (email: string, automaticResend: boolean = false) => {
        router.push({
            pathname: "bottomSheet/otpVerification",
            params: {
                type: "signup",
                title: t("auth.otp_verification.email"),
                email,
                handlerType: OtpVerificationHandlerType.SignUp,
                automaticResend: automaticResend.toString()
            }
        });
    };

    const signUp = async (request: SignUpRequest) => {
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
                    data: {
                        firstname: request.firstname,
                        lastname: request.lastname,
                        avatar_color: avatarColor,
                        currency_id: getUserLocalCurrency()
                    }
                }
            });

            if(error) throw error;
            if(!supabaseUser?.email) throw { code: "user_not_found" } as AuthError;

            updateNotVerifiedEmail(supabaseUser.email).catch(console.error);
            openAccountVerification(supabaseUser.email);
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

        if(error.code === "email_not_confirmed") return openAccountVerification(request.email, true);

        if(notVerifiedEmail === request.email) updateNotVerifiedEmail(null).catch(console.error);

        console.log("signIn error:", error);
        const toastMessage = getToastMessage({ messages: SignInToast, error });
        openToast(toastMessage);
    };

    const signOut = async (disabledToast: boolean = false) => {
        try {
            if(!session) return;

            const { error } = await supabaseConnector.client.auth.signOut();

            if(error) throw error;

            if(!disabledToast) openToast(SignOutToast.success());
        } catch(error) {
            if(disabledToast || !(error instanceof AuthError)) return; // if not auth error just skip
            openToast(getToastMessage({ messages: SignOutToast, error }));
        }
    };

    const deleteAccount = async () => {
        try {
            if(!session?.user.email) throw { code: "session_not_found" };

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
                    title: t("auth.otp_verification.delete_account"),
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

    const fetchNotVerifiedEmail = async () => {
        const newNotVerifiedEmail = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_EMAIL);
        if(!newNotVerifiedEmail) return;

        setNotVerifiedEmail(newNotVerifiedEmail);
    };

    const updateNotVerifiedEmail = async (newNotVerifiedEmail: string | null) => {
        setNotVerifiedEmail(newNotVerifiedEmail);

        if(newNotVerifiedEmail) {
            await AsyncStorage.setItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_EMAIL, newNotVerifiedEmail);
        } else {
            await AsyncStorage.removeItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_EMAIL);
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
                sessionUserId: session?.user.id ?? null,
                authenticated: authenticated,
                hasPassword,
                providers,
                openAccountVerification,
                signUp,
                signIn,
                signOut,
                deleteAccount,
                refreshSession,
                notVerifiedEmail: notVerifiedEmail,
                updateNotVerifiedEmail
            };
        },
        [
            session?.user,
            authenticated,
            openAccountVerification,
            signUp,
            signIn,
            signOut,
            deleteAccount,
            refreshSession,
            notVerifiedEmail,
            updateNotVerifiedEmail
        ]
    );

    return (
        <AuthContext.Provider value={ value }>
            { children }
        </AuthContext.Provider>
    );
};