import { HandleVerificationOtpType } from "../components/forms/VerifyOtpForm.tsx";
import { getToastMessage } from "../../../ui/alert/utils/getToastMessage.ts";
import { ChangeEmailToast, DeleteUserToast, ResetPasswordToast, SignUpToast } from "../presets/toast/index.ts";
import { router } from "expo-router";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { OtpVerificationHandlerType } from "../../../app/bottomSheet/otpVerification.tsx";
import { useAuth } from "../../../contexts/auth/AuthContext.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";


export const useOtpVerificationHandler = () => {
    const { t } = useTranslation();
    const { supabaseConnector } = useDatabase();
    const { openToast } = useAlert();
    const { signOut } = useAuth();

    const handleSignUpVerification: HandleVerificationOtpType =
        async (errorCode) => {
            if(errorCode) {
                return openToast(
                    getToastMessage({
                        messages: SignUpToast,
                        error: { code: errorCode },
                        defaultErrorCode: "otp_error"
                    })
                );
            }

            openToast(SignUpToast.success());
            router.dismissAll();
            router.push("/auth");//authoz lehet vissza kell idk
        };

    const handleNewEmailVerification: HandleVerificationOtpType =
        async (errorCode) => {
            if(errorCode) {
                return openToast(
                    getToastMessage({
                        messages: ChangeEmailToast,
                        error: { code: errorCode ?? "error" }
                    })
                );
            }

            openToast(ChangeEmailToast.success());
            await signOut(true);
        };

    const handleCurrentEmailVerification = (email?: string): HandleVerificationOtpType =>
        async (errorCode) => {
            if(errorCode || !email) {
                return openToast(
                    getToastMessage({
                        messages: ChangeEmailToast,
                        error: { code: errorCode ?? "error" }
                    })
                );
            }

            router.replace({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "email_change",
                    title: t("auth.otp_verification.new_email"),
                    email,
                    handlerType: OtpVerificationHandlerType.NewEmailChange
                }
            });
        };

    const handlePasswordResetVerification = (newPassword?: string): HandleVerificationOtpType =>
        async (errorCode) => {
            if(errorCode || !newPassword) {
                return openToast(
                    getToastMessage({
                        messages: ResetPasswordToast,
                        error: { code: errorCode ?? "error" }
                    })
                );
            }

            const { error } =
                await supabaseConnector
                .client
                .auth
                .updateUser({ password: newPassword });

            if(error && error.code !== "same_password") {
                return openToast(
                    getToastMessage({
                        messages: ResetPasswordToast,
                        error
                    })
                );
            }

            openToast(ResetPasswordToast.success());
            await signOut(true);
        };

    const handleUserDeleteVerification = (id?: string): HandleVerificationOtpType =>
        async (errorCode) => {
            if(errorCode || !id) {
                return openToast(
                    getToastMessage({
                        messages: DeleteUserToast,
                        error: { code: errorCode ?? "error" }
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
                        body: JSON.stringify({ id })
                    }
                );

            if(error) throw error;

            openToast(DeleteUserToast.success());
            await signOut(true);
        };

    return {
        handleSignUpVerification,
        handleNewEmailVerification,
        handleCurrentEmailVerification,
        handlePasswordResetVerification,
        handleUserDeleteVerification
    };
};