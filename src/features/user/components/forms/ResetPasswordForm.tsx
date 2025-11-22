import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import { UserAccount } from "../../schemas/userSchema.ts";
import { PasswordStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { ResetPasswordToast } from "../../presets/toast/index.ts";
import { OtpVerificationHandlerType } from "../../../../app/bottomSheet/otpVerification.tsx";
import { NewPasswordRequest, useNewPasswordFormProps } from "../../schemas/form/newPasswordRequest.ts";
import Form from "../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../components/Button/presets/FormButtons.tsx";
import React from "react";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";

export type ResetPasswordFormProps = { user: UserAccount }

export function ResetPasswordForm({ user }: ResetPasswordFormProps) {
    const { t } = useTranslation();
    const { supabaseConnector } = useDatabase();
    const { openToast } = useAlert();

    const form = useForm<NewPasswordRequest>(useNewPasswordFormProps());
    const { reset, handleSubmit } = form;

    const submitHandler = handleSubmit(async (request: NewPasswordRequest) => {
        try {
            const { error } = await supabaseConnector.client.auth.resetPasswordForEmail(user.email);

            if(error) throw error;

            router.push({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "recovery",
                    title: t("auth.otp_verification.password_reset"),
                    newPassword: request.password,
                    email: user.email,
                    handlerType: OtpVerificationHandlerType.PasswordReset
                }
            });
        } catch(error) {
            console.log("Reset password error: ", error);
            openToast(getToastMessage({ messages: ResetPasswordToast, error }));
        }
    });

    return (
        <Form>
            <PasswordStep { ...form }/>
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}