import { useDatabase } from "../features/Database/connector/Database.ts";
import { useAlert } from "../features/Alert/context/AlertProvider.tsx";
import { useSession } from "../features/Auth/context/SessionProvider.tsx";
import { UserFormFieldType } from "../features/Form/constants/schemas/userSchema.tsx";
import { SignInFormFieldType } from "../features/Form/constants/schemas/signInSchema.tsx";
import { AuthError, GenerateLinkParams, Provider, ResendParams, VerifyEmailOtpParams } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../constants/constants.ts";
import { router } from "expo-router";
import { useBottomSheet } from "../features/BottomSheet/context/BottomSheetContext.ts";
import { ChangeEmailToast, ChangeNameToast, DeleteUserToast, ResetPasswordToast, SignInToast, SignOutToast, SignUpToast } from "../features/Alert/presets/toast";
import { HandleVerificationOtpType } from "../features/Auth/components/VerifyOTP.tsx";
import { getToastMessage } from "../features/Alert/utils/getToastMessage.ts";
import { OTPVerificationBottomSheet } from "../features/BottomSheet/presets";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

export type SignUpFunction = (user: UserFormFieldType) => Promise<void>
export type SignInFunction = (user: SignInFormFieldType) => Promise<void>
export type ChangeEmailFunction = (newEmail: string) => Promise<void>
export type ChangeNameFunction = (firstname: string, lastname: string) => Promise<void>
export type ResetPasswordFunction = (newPassword: string) => Promise<void>

const useAuth = () => {
    const database = useDatabase();
    const { supabaseConnector } = database;
    const { session, setNotVerifiedUser, refreshSession } = useSession();
    const { addToast } = useAlert();
    const { openBottomSheet, dismissAllBottomSheet } = useBottomSheet();

    const openUserVerification = (email: string) => {
        const handleSignUpVerification: HandleVerificationOtpType =
            async (errorCode) => {
                if(errorCode) {
                    return addToast(
                        getToastMessage({
                            messages: SignUpToast,
                            error: { code: errorCode },
                            defaultErrorCode: "otp_error"
                        })
                    );
                }

                addToast(SignUpToast.success());
                dismissAllBottomSheet();
            }

        openBottomSheet(
            OTPVerificationBottomSheet({
                type: "signup",
                title: "Email cím hitelesítés",
                email,
                handleVerification: handleSignUpVerification
            })
        );
    }

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
            if(emailExists) throw { code: "email_exists" } as AuthError;

            const {
                data: {
                    user: newUser
                },
                error
            } = await supabaseConnector
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
            await AsyncStorage
                .setItem(
                    LOCAL_STORAGE_KEYS.notConfirmedUser,
                    JSON.stringify(newUser)
                );

            if(newUser?.email) openUserVerification(newUser.email);
        } catch (error) {
            addToast(getToastMessage({ messages: SignUpToast, error }));
        }
    }

    GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
        webClientId: "251073631752-trpq7qoo5hniiok8vdfnm8ui2bd1p6sb.apps.googleusercontent.com"
    });

    const googleAuth = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { data: googleData } = await GoogleSignin.signIn();

            if(!googleData?.idToken) throw { code: "token_missing" };

            const { data: { user }, error } =
                await supabaseConnector
                    .client
                    .auth
                    .signInWithIdToken({
                        provider: "google",
                        token: googleData.idToken
                    });

            if(error) throw error;
            if(!user) throw { code: "user_not_found" };

            const { data: userData, error: s } = await supabaseConnector.client.auth.getUserIdentities()

            // login tortent igy a nevet ne mentsuk le
            if(user.app_metadata.providers && user.app_metadata.providers.length > 1) return;

            // uj fiok kerult letrehozasra, mentsuk le a nevet a felhasznalonak
            await supabaseConnector
                .client
                .auth
                .updateUser({
                    data: {
                        firstname: googleData.user.givenName || "",
                        lastname: googleData.user.familyName || "",
                    }
                });
        } catch (error: any) {
            console.log(error.code, error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
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
                    return openUserVerification(user.email);
                }

                throw error;
            }

            addToast(SignInToast.success());
            dismissAllBottomSheet();
        } catch (error) {
            addToast(getToastMessage({ messages: SignInToast, error }));
        }
    }

    const signOut = async (disabledToast: boolean = false) => {
        try {
            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .signOut();

            if(error) throw error;

            router.replace("/backToRootIndex");
            if(!disabledToast) addToast(SignOutToast.success());
            await database.disconnect();
        } catch (error) {
            if(error instanceof AuthError && !disabledToast) return addToast(getToastMessage({ messages: SignOutToast, error }));
            // ha nem AuthError akkor sikeres a kijelentkezes, de mashol hiba tortent (pl: powersync)
        }
    }

    const changeEmail: ChangeEmailFunction = async (
        newEmail
    ) => {
        try {
            if(!session) throw { code: "session_not_found" };
            if(!session.user.email) throw { code: "email_not_found" };

            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .updateUser({
                        email: newEmail
                    });

            if(error) throw error;

            const handleCurrentEmailVerification: HandleVerificationOtpType =
                async (errorCode) => {
                    if(errorCode) {
                        return addToast(
                            getToastMessage({
                                messages: ChangeEmailToast,
                                error: { code: errorCode }
                            })
                        );
                    }

                    const handleNewEmailVerification: HandleVerificationOtpType =
                        async (errorCode) => {
                            if(errorCode) {
                                return addToast(
                                    getToastMessage({
                                        messages: ChangeEmailToast,
                                        error: { code: errorCode }
                                    })
                                );
                            }

                            addToast(ChangeEmailToast.success());
                            dismissAllBottomSheet();
                            await signOut(true);
                        }

                    openBottomSheet(
                        OTPVerificationBottomSheet({
                            type: "email_change",
                            title: "Új email cím hitelesítés",
                            email: newEmail,
                            handleVerification: handleNewEmailVerification
                        })
                    )
                }

            openBottomSheet(
                OTPVerificationBottomSheet({
                    type: "email_change",
                    title: "Email módosítási kérelem hitelesítés",
                    email: session.user.email,
                    handleVerification: handleCurrentEmailVerification
                })
            );
        } catch (error) {
            addToast(
                getToastMessage({
                    messages: ChangeEmailToast,
                    error
                })
            );
        }
    }

    const changeName: ChangeNameFunction = async (
        firstname,
        lastname
    ) => {
        try {
            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .updateUser({
                        data: {
                            firstname,
                            lastname
                        }
                    });

            if(error) throw error;

            addToast(ChangeNameToast.success());
            dismissAllBottomSheet();
        } catch (error) {
            addToast(getToastMessage({ messages: ChangeNameToast, error }));
        }
    }

    const addPasswordToOAuthUser: ResetPasswordFunction = async (
        newPassword
    ) => {
        try {
            if(!session) throw { code: "session_not_found" } as AuthError;
            if(session.user.user_metadata.has_password) throw { code: "has_password" };

            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .updateUser({
                        password: newPassword
                    });

            if(error) throw error;

            addToast({ type: "success", title: "SIKER" })
            await refreshSession();
        } catch (error) {
            console.error(error, "lol");
        }
    }

    const resetPassword: ResetPasswordFunction = async (
        newPassword
    ) => {
        try {
            if(!session) throw { code: "session_not_found" };
            if(!session.user.email) throw { code: "email_not_found" };

            const { error } =
                await supabaseConnector
                    .client
                    .auth
                    .resetPasswordForEmail(session.user.email);

            if(error) throw error;

            const handleResetPasswordVerification: HandleVerificationOtpType =
                async (errorCode) => {
                    if(errorCode) {
                        return addToast(
                            getToastMessage({
                                messages: ResetPasswordToast,
                                error: { code: errorCode }
                            })
                        );
                    }

                    const { error } =
                        await supabaseConnector
                            .client
                            .auth
                            .updateUser(
                                {
                                    password: newPassword
                                }
                            );

                    if(error && error.code !== "same_password") {
                        return addToast(
                            getToastMessage({
                                messages: ResetPasswordToast,
                                error
                            })
                        );
                    }

                    addToast(ResetPasswordToast.success());
                    dismissAllBottomSheet();
                    await signOut(true);
                }

            openBottomSheet(
                OTPVerificationBottomSheet({
                        type: "recovery",
                        title: "Jelszó módosítása",
                        email: session.user.email,
                        handleVerification: handleResetPasswordVerification
                })
            );
        } catch (error){
            addToast(getToastMessage({ messages: ResetPasswordToast, error }));
        }
    }

    const deleteUserProfile = async () => {
        if(session?.user){
            try {
                if(!session) throw { code: "session_not_found" };
                if(!session.user.email) throw { code: "email_not_found" };

                const emailParams: GenerateLinkParams = {
                    type: "magiclink",
                    email: session.user.email,
                }

                const { error } =
                    await supabaseConnector
                        .client
                        .functions
                        .invoke(
                            "generate-email",
                            {
                                method: "POST",
                                body: JSON.stringify(emailParams)
                            }
                        );

                if (error) throw error;

                const handleDeleteUserVerification: HandleVerificationOtpType =
                    async (errorCode) => {
                        if(errorCode) {
                            return addToast(
                                getToastMessage({
                                    messages: DeleteUserToast,
                                    error: { code: errorCode }
                                })
                            );
                        }

                        const { error } =
                            await supabaseConnector
                                .client
                                .functions
                                .invoke(
                                    "delete-user",
                                    {
                                        method: "DELETE",
                                        body: JSON.stringify({ id: session.user.id })
                                    }
                                );

                        if(error) throw error;

                        addToast(DeleteUserToast.success());
                        dismissAllBottomSheet();
                        await signOut(true);
                    }

                openBottomSheet(
                    OTPVerificationBottomSheet({
                        type: "magiclink", // magiclink viselkedik ugy mint ha torlest verifyolna *mivel supabasebe nincs implementalva ez meg*
                        title: "Fiók törlése",
                        email: emailParams.email,
                        handleVerification: handleDeleteUserVerification
                    })
                );
            } catch (error) {
                addToast(getToastMessage({ messages: DeleteUserToast, error }));
            }
        }
    }

    const verifyOTP = async (args: VerifyEmailOtpParams) => {
        const { data, error } =
            await supabaseConnector
                .client
                .auth
                .verifyOtp(args);

        if(error) throw error;

        if(data.session) {
            await supabaseConnector
                .client
                .auth
                .setSession(data.session);
        }
    }

    const resendOTP = async (args: ResendParams)=> {
        const { error } =
            await supabaseConnector
                .client
                .auth
                .resend(args);

        if(error) throw error;
    }

    const linkIdentity = async (provider: Provider) => {
        try {
            if(!session) throw { code: "session_not_found" } as AuthError;

            const userProviders: Array<string> = session.user.app_metadata.providers || [session.user.app_metadata.provider];
            if(userProviders.includes(provider)) throw { code: "identity_already_exists" } as AuthError;

            // nincs megvalositva meg Supabaseben (native flowra) az identity hozzarendeles, igy automatic linking lesz ujra beloginoltatassal (de mas emailre nem rakhato)
        } catch (error) {
            console.log("linkIdentity error: ", error);
        }
    }

    return {
        signUp,
        signIn,
        signOut,
        googleAuth,
        openUserVerification,
        changeEmail,
        changeName,
        resetPassword,
        addPasswordToOAuthUser,
        deleteUserProfile,
        verifyOTP,
        resendOTP,
        linkIdentity
    }
}

export default useAuth;