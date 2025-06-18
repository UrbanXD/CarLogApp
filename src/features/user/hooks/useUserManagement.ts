import { useDatabase } from "../../../database/connector/Database.ts";
import { useAlert } from "../../Alert/context/AlertProvider.tsx";
import { useBottomSheet } from "../../../contexts/BottomSheet/BottomSheetContext.ts";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { BaseConfig } from "../../../constants/BaseConfig.ts";
import { HandleVerificationOtpType } from "../components/forms/VerifyOtpForm.tsx";
import { getToastMessage } from "../../Alert/utils/getToastMessage.ts";
import {
    AddPasswordToast,
    ChangeEmailToast,
    ChangeNameToast,
    DeleteUserToast,
    GoogleAuthToast,
    ResetPasswordToast,
    SignInToast,
    SignOutToast,
    SignUpToast
} from "../../Alert/presets/toast/index.ts";
import { OTPVerificationBottomSheet } from "../../../components/BottomSheet/presets/index.ts";
import {
    AuthError,
    GenerateLinkParams,
    Provider,
    ResendParams,
    VerifyEmailOtpParams
} from "@supabase/supabase-js";
import { AVATAR_COLOR } from "../../../constants/index.ts";
import { router } from "expo-router";
import { SignInFormFieldType, SignUpFormFieldType } from "../schemas/userSchema.tsx";
import { useAuth } from "../../../contexts/Auth/AuthContext.ts";
import { UserTableType } from "../../database/connector/powersync/AppSchema.ts";
import { ToastMessages } from "../../Alert/constants/types.ts";
import getImageState from "../../../database/utils/getImageState.ts";
import { getPathFromImageType } from "../../../utils/getPathFromImageType.ts";

export type SignUpFunction = (user: SignUpFormFieldType) => Promise<void>
export type SignInFunction = (user: SignInFormFieldType) => Promise<void>
export type ChangeEmailFunction = (newEmail: string) => Promise<void>
export type ChangeUserMetadataFunction = (newUser: Partial<UserTableType> | null, toastMessages: ToastMessages) => Promise<void>
export type ResetPasswordFunction = (newPassword: string) => Promise<void>

export const useUserManagement = () => {
    const database = useDatabase();
    const { supabaseConnector, attachmentQueue, userDAO } = database;
    const { session, user, userAvatar, setUser, updateNotVerifiedUser, refreshSession } = useAuth();
    const { addToast } = useAlert();
    const { openBottomSheet, dismissAllBottomSheet } = useBottomSheet();

    GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
        webClientId: BaseConfig.GOOGLE_WEBCLIENTID
    });

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
                                lastname,
                                avatarColor: AVATAR_COLOR[Math.floor(Math.random() * AVATAR_COLOR.length)],
                            }
                        }
                    });

            if(error) throw error;

            void updateNotVerifiedUser(newUser);

            if(newUser?.email) {
                openUserVerification(newUser.email);
                await userDAO.insertUser({
                    id: newUser.id,
                    email: newUser.email,
                    firstname: newUser.user_metadata.firstname,
                    lastname: newUser.user_metadata.lastname,
                    avatarColor: newUser.user_metadata.avatarColor,
                    avatarImage: newUser.user_metadata.avatarImage,
                });
            }
        } catch (error) {
            addToast(
                getToastMessage({
                    messages: SignUpToast,
                    error
                })
            );
        }
    }

    const googleAuth = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { data: googleData } = await GoogleSignin.signIn();
            if(!googleData?.idToken) throw { code: "token_missing" };

            const { data: alreadyRegistered } =
                await supabaseConnector
                    .client
                    .rpc(
                        "email_exists",
                        { email_address: googleData.user.email }
                    );

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

            // login tortent igy a nevet ne mentsuk le
            if(alreadyRegistered) {
                addToast(SignInToast.success());
                return dismissAllBottomSheet();
            }

            // uj fiok kerult letrehozasra, mentsuk le a nevet a felhasznalonak
            await userDAO.insertUser({
                id: user.id,
                email: user.email,
                firstname: googleData.user.givenName || "",
                lastname: googleData.user.familyName || "",
                avatarColor: AVATAR_COLOR[Math.floor(Math.random() * AVATAR_COLOR.length)],
                avatarImage: null
            });

            addToast(SignUpToast.success());
            dismissAllBottomSheet();
        } catch (error) {
            addToast(
                getToastMessage({
                    messages: GoogleAuthToast,
                    error
                })
            );
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
            addToast(
                getToastMessage({
                    messages: SignInToast,
                    error
                })
            );
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
            if(error instanceof AuthError && !disabledToast) {
                return addToast(
                    getToastMessage({
                        messages: SignOutToast,
                        error
                    })
                );
            }
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

    const changeUserMetadata: ChangeUserMetadataFunction = async (
        newUser,
        toastMessages
    ) => {
        try {
            let newUserAvatar = userAvatar;
            if(newUser?.avatarImage && user?.avatarImage !== getPathFromImageType(newUser.avatarImage, user?.id)) {
                try {

                } catch (_) {

                }
                const newAvatarImage = await attachmentQueue.saveFile(newUser.avatarImage, user.id);
                newUserAvatar = getImageState(newAvatarImage.filename, newUser.avatarImage.buffer);
            }

            const updatedUser = await userDAO.updateUser({
                ...user,
                ...newUser,
                avatarImage: newUserAvatar ? newUserAvatar.path : null
            });

            setUser(updatedUser, newUserAvatar);

            addToast(toastMessages.success());
            dismissAllBottomSheet();
        } catch (error) {
            console.log(error)
            addToast(
                getToastMessage({
                    messages: toastMessages,
                    error
                })
            );
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

            addToast(AddPasswordToast.success())
            await refreshSession();
        } catch (error) {
            addToast(
                getToastMessage({
                    messages: AddPasswordToast,
                    error
                })
            );
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
            addToast(
                getToastMessage({
                    messages: ResetPasswordToast,
                    error
                })
            );
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
                addToast(
                    getToastMessage({
                        messages: DeleteUserToast,
                        error
                    })
                );
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
        changeUserMetadata,
        resetPassword,
        addPasswordToOAuthUser,
        deleteUserProfile,
        verifyOTP,
        resendOTP,
        linkIdentity
    }
}