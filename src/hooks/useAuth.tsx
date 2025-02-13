import { useDatabase } from "../features/Database/connector/Database.ts";
import { useAlert } from "../features/Alert/context/AlertProvider.tsx";
import { useSession } from "../features/Auth/context/SessionProvider.tsx";
import { SignUpFormFieldType } from "../features/Form/constants/schemas/signUpSchema.tsx";
import { SignInFormFieldType } from "../features/Form/constants/schemas/signInSchema.tsx";
import { AuthApiError, AuthError } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../constants/constants.ts";
import { router } from "expo-router";
import { useBottomSheet } from "../features/BottomSheet/context/BottomSheetContext.ts";
import { EmailVerificationBottomSheet } from "../features/BottomSheet/presets/index.ts";
import { SignInToast, SignOutToast, SignUpToast } from "../features/Alert/presets/toast/index.ts";

export type SignUpFunction = (user: SignUpFormFieldType) => Promise<void>

export type SignInFunction = (user: SignInFormFieldType) => Promise<void>

export type ResetPasswordFunction = (newPassword: string) => Promise<void>

const useAuth = () => {
    const { supabaseConnector, powersync } = useDatabase();
    const { setNotVerifiedUser } = useSession();
    const { addToast } = useAlert();
    const { openBottomSheet, dismissBottomSheet, dismissAllBottomSheet } = useBottomSheet();

    const signUp: SignUpFunction = async (user) => {
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

            setNotVerifiedUser(newUser);
            await AsyncStorage.setItem(
                LOCAL_STORAGE_KEYS.notConfirmedUser,
                JSON.stringify(newUser)
            );

            await dismissBottomSheet();
            openBottomSheet(EmailVerificationBottomSheet(addToast));
        } catch (error) {
            let toast = SignUpToast[error.code];
            if(!toast) toast = SignUpToast.error;

            addToast(toast);
        }
    }

    const signIn: SignInFunction = async (user) => {
        try {
            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .signInWithPassword(user);

            if (error) {
                if(error.code === "email_not_confirmed") {
                    router.push({
                        pathname: "/verify",
                        params: {
                            type: "signup",
                            title: "Email cím hitelesítés",
                            email: user.email,
                            toastMessages: JSON.stringify(SignInToast),
                            replaceHREF: "/(main)"
                        }
                    });
                    return;
                }

                throw error;
            }

            await dismissAllBottomSheet();
        } catch (error) {
            if(error.code) {
                const toastMessage = SignInToast[error.code];
                if(toastMessage) return addToast(toastMessage);
            }

            addToast(SignInToast.error);
        }
    }

    const signOut = async () => {
        try {
            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .signOut();

            if(error) throw error;

            router.replace("/backToRootIndex");
            addToast(SignOutToast.success);
            await powersync.disconnectAndClear();
        } catch (error) {
            if(error instanceof AuthError) return addToast(SignOutToast.error);
            // ha nem AuthError akkor sikeres a kijelentkezes, de mashol hiba tortent
        }
    }

    const resetPassword: ResetPasswordFunction = async (newPassword) => {
        try {
            console.log("feaf")
            const { data, error } =
                await supabaseConnector
                    .client
                    .auth
                    .resetPasswordForEmail(session?.user.email);
            console.log("fgesfs")

            // router.push({
            //     pathname: "/verify",
            //     params: {
            //         type: "recovery",
            //         title: "Jelszó módosítás",
            //         email: email,
            //         toastMessages: JSON.stringify(signUpToast),
            //         replaceHREF: "/(main)"
            //     }
            // });
        } catch (_){

        }
    }

    const deleteUserProfile = async () => {
        if(session?.user){
            const { error } =
                await supabaseConnector
                    .client
                    .functions
                    .invoke(
                        "delete-user",
                        {
                            method: "DELETE",
                            body: JSON.stringify({ id: user.id })
                        }
                    );

            if(!error) {
                await signOut();
            }
        }
    }

    return {
        signUp,
        signIn,
        signOut,
        resetPassword,
        deleteUserProfile
    }
}

export default useAuth;