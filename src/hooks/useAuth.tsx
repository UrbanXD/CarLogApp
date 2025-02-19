import { useDatabase } from "../features/Database/connector/Database.ts";
import { useAlert } from "../features/Alert/context/AlertProvider.tsx";
import { useSession } from "../features/Auth/context/SessionProvider.tsx";
import { UserFormFieldType } from "../features/Form/constants/schemas/userSchema.tsx";
import { SignInFormFieldType } from "../features/Form/constants/schemas/signInSchema.tsx";
import { AuthError, GenerateLinkParams } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../constants/constants.ts";
import { router } from "expo-router";
import { useBottomSheet } from "../features/BottomSheet/context/BottomSheetContext.ts";
import { DeleteUserVerificationBottomSheet, ResetPasswordVerificationBottomSheet, SignUpVerificationBottomSheet } from "../features/BottomSheet/presets/index.ts";
import { ChangeNameToast, DeleteUserToast, ResetPasswordToast, SignInToast, SignOutToast, SignUpToast } from "../features/Alert/presets/toast";
import { HandleVerificationOtpType } from "../features/Auth/components/VerifyOTP.tsx";
import { getToastMessage } from "../features/Alert/utils/getToastMessage.ts";

export type SignUpFunction = (user: UserFormFieldType) => Promise<void>

export type SignInFunction = (user: SignInFormFieldType) => Promise<void>

export type ChangeEmailFunction = (newEmail: string) => Promise<void>

export type ChangeNameFunction = (firstname: string, lastname: string) => Promise<void>

export type ResetPasswordFunction = (newPassword: string) => Promise<void>

const useAuth = () => {
    const { supabaseConnector, powersync } = useDatabase();
    const { session, setNotVerifiedUser } = useSession();
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
                    )
                }

                addToast(SignUpToast.success());
                dismissAllBottomSheet();
            }

        openBottomSheet(
            SignUpVerificationBottomSheet(
                email,
                handleSignUpVerification
            )
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
            await powersync.disconnectAndClear();
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

            const emailParams: GenerateLinkParams = {
                type: "email_change_new",
                email: session.user.email,
                newEmail
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

            // const { error } =
            //     await supabaseConnector
            //         .client
            //         .auth
            //         .updateUser({
            //             password: newEmail
            //         });
            //
            // if(error) throw error;

            addToast(ChangeNameToast.success());
            await dismissAllBottomSheet();
        } catch (error) {
            addToast(getToastMessage({ messages: ChangeNameToast, error }));
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
                    if(errorCode) return addToast(getToastMessage({ messages: ResetPasswordToast, error: { code: errorCode } }));

                    const { error } =
                        await supabaseConnector
                            .client
                            .auth
                            .updateUser(
                                {
                                    password: newPassword
                                }
                            );

                    if(error && error.code !== "same_password") return addToast(getToastMessage({ messages: ResetPasswordToast, error }));

                    addToast(ResetPasswordToast.success());
                    dismissAllBottomSheet();
                }

            openBottomSheet(
                ResetPasswordVerificationBottomSheet(
                    session?.user.email,
                    handleResetPasswordVerification
                )
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
                        if(errorCode) throw { code: errorCode };

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

                        dismissAllBottomSheet();
                        await signOut(true);
                        addToast(DeleteUserToast.success());
                    }

                openBottomSheet(
                    DeleteUserVerificationBottomSheet(
                        emailParams.email,
                        handleDeleteUserVerification
                    )
                )
            } catch (error) {
                addToast(getToastMessage({ messages: DeleteUserToast, error }));
            }
        }
    }

    return {
        signUp,
        signIn,
        signOut,
        openUserVerification,
        changeEmail,
        changeName,
        resetPassword,
        deleteUserProfile
    }
}

export default useAuth;