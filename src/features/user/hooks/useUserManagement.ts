import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { getToastMessage } from "../../../ui/alert/utils/getToastMessage.ts";
import { AddPasswordToast, ChangeEmailToast, DeleteUserToast, ResetPasswordToast } from "../presets/toast/index.ts";
import { OtpVerificationBottomSheet } from "../presets/bottomSheet/index.ts";
import { AuthError, GenerateLinkParams, Provider, ResendParams, VerifyEmailOtpParams } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useAuth } from "../../../contexts/auth/AuthContext.ts";
import { UserTableType } from "../../database/connector/powersync/AppSchema.ts";
import { ToastMessages } from "../../../ui/alert/model/types/index.ts";
import getImageState from "../../../database/utils/getImageState.ts";
import { getPathFromImageType } from "../../../utils/getPathFromImageType.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { OtpVerificationHandlerType } from "../../../app/bottomSheet/otpVerification.tsx";

export const useUserManagement = () => {
    const database = useDatabase();
    const { supabaseConnector, attachmentQueue, userDAO } = database;
    const { session, user, setUser, refreshSession } = useAuth();
    const { openToast } = useAlert();

    const changeEmail = async (newEmail: string) => {
        try {
            if(!session) throw { code: "session_not_found" };
            if(!session.user.email) throw { code: "email_not_found" };

            const { error } =
                await supabaseConnector
                .client
                .auth
                .updateUser({ email: newEmail });

            if(error) throw error;

            router.push({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "email_change",
                    title: "Email módosítási kérelem hitelesítés PLS",
                    email: session.user.email,
                    newEmail,
                    handlerType: OtpVerificationHandlerType.CurrentEmailChange
                }
            });
        } catch(error) {
            openToast(
                getToastMessage({
                    messages: ChangeEmailToast,
                    error
                })
            );
        }
    };

    const changeUserMetadata = async (newUser: Partial<UserTableType> | null, toastMessages: ToastMessages) => {
        try {
            let newUserAvatar = user.userAvatar;
            if(newUser?.avatarImage && user?.avatarImage !== getPathFromImageType(newUser.avatarImage, user?.id)) {
                const newAvatarImage = await attachmentQueue.saveFile(newUser.avatarImage, user.id);
                newUserAvatar = getImageState(newAvatarImage.filename, newUser.avatarImage.buffer);
            }

            const updatedUser = await userDAO.updateUser({
                ...user,
                ...newUser,
                avatarImage: newUserAvatar ? newUserAvatar.path : null
            });

            setUser(updatedUser, newUserAvatar);

            openToast(toastMessages.success());
            router.dismissTo("(profile)/user");
        } catch(error) {
            console.log(error);
            openToast(
                getToastMessage({
                    messages: toastMessages,
                    error
                })
            );
        }
    };

    const addPasswordToOAuthUser = async (newPassword: string) => {
        try {
            if(!session) throw { code: "session_not_found" } as AuthError;
            if(session.user.user_metadata.has_password) throw { code: "has_password" };

            const { error } =
                await supabaseConnector
                .client
                .auth
                .updateUser({ password: newPassword });

            if(error) throw error;

            openToast(AddPasswordToast.success());
            await refreshSession();
        } catch(error) {
            openToast(
                getToastMessage({
                    messages: AddPasswordToast,
                    error
                })
            );
        }
    };

    const resetPassword = async (newPassword: string) => {
        try {
            if(!session) throw { code: "session_not_found" };
            if(!session.user.email) throw { code: "email_not_found" };

            const { error } =
                await supabaseConnector
                .client
                .auth
                .resetPasswordForEmail(session.user.email);

            if(error) throw error;

            router.push({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "recovery",
                    title: "Jelszó módosítása",
                    newPassword,
                    email: session.user.email,
                    handlerType: OtpVerificationHandlerType.PasswordReset
                }
            });
        } catch(error) {
            openToast(
                getToastMessage({
                    messages: ResetPasswordToast,
                    error
                })
            );
        }
    };

    const deleteUserProfile = async () => {
        if(session?.user) {
            try {
                if(!session) throw { code: "session_not_found" };
                if(!session.user.email) throw { code: "email_not_found" };

                const emailParams: GenerateLinkParams = {
                    type: "magiclink",
                    email: session.user.email
                };

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

                if(error) throw error;

                router.push({
                    pathname: "bottomSheet/otpVerification",
                    params: {
                        type: "magiclink", // magiclink viselkedik ugy mint ha torlest verifyolna *mivel supabasebe nincs implementalva ez meg*
                        title: "Fiók törlése",
                        email: emailParams.email,
                        userId: session.user.id,
                        handlerType: OtpVerificationHandlerType.UserDelete
                    }
                });
            } catch(error) {
                openToast(
                    getToastMessage({
                        messages: DeleteUserToast,
                        error
                    })
                );
            }
        }
    };

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
    };

    const resendOTP = async (args: ResendParams) => {
        const { error } =
            await supabaseConnector
            .client
            .auth
            .resend(args);

        if(error) throw error;
    };

    const linkIdentity = async (provider: Provider) => {
        try {
            if(!session) throw { code: "session_not_found" } as AuthError;

            const userProviders: Array<string> = session.user.app_metadata.providers || [session.user.app_metadata.provider];
            if(userProviders.includes(provider)) throw { code: "identity_already_exists" } as AuthError;

            // nincs megvalositva meg Supabaseben (native flowra) az identity hozzarendeles, igy automatic linking lesz ujra beloginoltatassal (de mas emailre nem rakhato)
        } catch(error) {
            console.log("linkIdentity error: ", error);
        }
    };

    return {
        changeEmail,
        changeUserMetadata,
        resetPassword,
        addPasswordToOAuthUser,
        deleteUserProfile,
        verifyOTP,
        resendOTP,
        linkIdentity
    };
};