import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { getToastMessage } from "../../../ui/alert/utils/getToastMessage.ts";
import { AddPasswordToast, ChangeEmailToast, DeleteUserToast, ResetPasswordToast } from "../presets/toast/index.ts";
import { OtpVerificationBottomSheet } from "../presets/bottomSheet/index.ts";
import { AuthError, GenerateLinkParams, Provider, ResendParams, VerifyEmailOtpParams } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useAuth } from "../../../contexts/auth/AuthContext.ts";
import { ToastMessages } from "../../../ui/alert/model/types/index.ts";
import getImageState from "../../../database/utils/getImageState.ts";
import { getPathFromImageType } from "../../../utils/getPathFromImageType.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { OtpVerificationHandlerType } from "../../../app/bottomSheet/otpVerification.tsx";
import { useAppDispatch, useAppSelector } from "../../../hooks/index.ts";
import { editUserName } from "../model/actions/editUserName.ts";
import { Image } from "../../../types/index.ts";
import { EditUserFormFieldType } from "../schemas/userSchema.ts";
import { getUser } from "../model/selectors/index.ts";

export const useUserManagement = () => {
    const database = useDatabase();
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);

    const { supabaseConnector, attachmentQueue, userDAO } = database;
    const { providers, authenticated, hasPassword, refreshSession } = useAuth();
    const { openToast } = useAlert();

    const changeEmail = async (newEmail: string) => {
        try {
            if(!authenticated) throw { code: "session_not_found" };
            if(!user?.email) throw { code: "email_not_found" };

            const { error } = await supabaseConnector.client.auth.updateUser({ email: newEmail });

            if(error) throw error;

            router.push({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "email_change",
                    title: "Email módosítási kérelem hitelesítés",
                    email: user.email,
                    newEmail,
                    handlerType: OtpVerificationHandlerType.CurrentEmailChange
                }
            });
        } catch(error) {
            openToast(getToastMessage({ messages: ChangeEmailToast, error }));
        }
    };

    //TODO szetbontani edit name es edit avatarra
    const changeUserMetadata = async (newUser: EditUserFormFieldType | null, toastMessages: ToastMessages) => {
        try {
            //TODO ne itt mentse a kepet hanem vigyuk at az editUserAvatarba
            let newUserAvatar: Image | null = user?.userAvatar ?? null;
            if(newUser?.avatarImage && user?.userAvatar?.path !== getPathFromImageType(newUser.avatarImage, user?.id)) {
                const newAvatarImage = await attachmentQueue.saveFile(newUser.avatarImage, user.id);
                newUserAvatar = getImageState(newAvatarImage.filename, newUser.avatarImage.buffer);
            }

            await dispatch(editUserName({ database, newUser, newAvatar: newUserAvatar }));

            openToast(toastMessages.success());
            router.dismissTo("(profile)/user");
        } catch(error) {
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
            if(!authenticated) throw { code: "session_not_found" };
            if(!user?.email) throw { code: "email_not_found" };
            if(hasPassword) throw { code: "has_password" };

            const { error } = await supabaseConnector.client.auth.updateUser({ password: newPassword });

            if(error) throw error;

            openToast(AddPasswordToast.success());
            await refreshSession();
        } catch(error) {
            openToast(getToastMessage({ messages: AddPasswordToast, error }));
        }
    };

    const resetPassword = async (newPassword: string) => {
        try {
            if(!authenticated) throw { code: "session_not_found" };
            if(!user?.email) throw { code: "email_not_found" };

            const { error } = await supabaseConnector.client.auth.resetPasswordForEmail(user.email);

            if(error) throw error;

            router.push({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "recovery",
                    title: "Jelszó módosítása",
                    newPassword,
                    email: user.email,
                    handlerType: OtpVerificationHandlerType.PasswordReset
                }
            });
        } catch(error) {
            openToast(getToastMessage({ messages: ResetPasswordToast, error }));
        }
    };

    const deleteUserProfile = async () => {
        if(!user) return;

        try {
            if(!authenticated) throw { code: "session_not_found" };
            if(!user?.email) throw { code: "email_not_found" };

            const emailParams: GenerateLinkParams = { type: "magiclink", email: user.email };

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
                    title: "Fiók törlése",
                    email: emailParams.email,
                    userId: user.id,
                    handlerType: OtpVerificationHandlerType.UserDelete
                }
            });
        } catch(error) {
            openToast(getToastMessage({ messages: DeleteUserToast, error }));
        }
    };

    const verifyOTP = async (args: VerifyEmailOtpParams) => {
        const { data, error } = await supabaseConnector.client.auth.verifyOtp(args);

        if(error) throw error;

        await supabaseConnector.client.auth.setSession(data.session);
    };

    const resendOTP = async (args: ResendParams) => {
        const { error } = await supabaseConnector.client.auth.resend(args);

        if(error) throw error;
    };

    const linkIdentity = async (provider: Provider) => {
        try {
            if(!authenticated) throw { code: "session_not_found" };

            if(providers?.includes(provider)) throw { code: "identity_already_exists" } as AuthError;

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